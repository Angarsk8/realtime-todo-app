require "kemal"
require "json"
require "pg"
require "./app/lib/note"

public_folder "src/public"

conn = PG.connect "postgres://Angarsk8@localhost:5432/notes_db"
sockets = [] of HTTP::WebSocket

get "/" do |env|
  notes = JSON.parse(Note.all(conn).to_json)
  render "src/views/home.ecr", "src/views/layout.ecr"
end

ws "/notes" do |socket|
  # Store the new connection in the sockets list
  sockets.push socket

  # Handle incoming message and dispatch notes to all connected clients
  socket.on_message do |msg|
    payload = JSON.parse(msg).as_h

    # Handle message type to perform different CRUD operations
    case payload["type"]
    when "CREATE"
      Note.create_from(payload).insert(conn)
    when "UPDATE"
      Note.create_from(payload).update(conn)
    when "DELETE"
      Note.create_from(payload).delete(conn)
    else
      next
    end

    sockets.each do |s|
      s.send Note.all(conn).to_json
    end
  end

  # Handle disconnection and clean sockets
  socket.on_close do |_|
    sockets.delete(socket)
    puts "Closing Socket: #{socket}"
  end
end

Kemal.run
