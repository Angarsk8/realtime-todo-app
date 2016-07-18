require "kemal"
require "json"
require "pg"
require "./app/lib/note"

public_folder "src/public"

# COMPOSE = ".compose_psql_path"
COMPOSE = ".compose_psql_path_wrong_path"

DB_PATH = File.file?(COMPOSE) ? File.read(COMPOSE) : "postgres://Angarsk8@localhost:5432/notes_db"

conn = PG.connect DB_PATH
sockets = [] of HTTP::WebSocket

get "/" do |env|
  notes = JSON.parse(Note.all(conn).to_json)
  render "src/views/home.ecr", "src/views/layout.ecr"
end

ws "/notes" do |socket|
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
      begin
        s.send Note.all(conn).to_json
      rescue ex
        sockets.delete(s)
        puts "Closing Socket: #{s}"
      end
    end
  end

  # Handle disconnection and clean sockets
  socket.on_close do |_|
    sockets.delete(socket)
    puts "Closing Socket: #{socket}"
  end
end

Kemal.run
