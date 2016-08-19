require "kemal"
require "pg"

require "./app/lib/*"

public_folder "src/public"

DB_PATH = "postgres://postgres:postgres@db:5432/notes_db"

conn = PG.connect DB_PATH
sockets = [] of HTTP::WebSocket

get "/" do |env|
  render "src/views/layout.ecr"
end

ws "/notes" do |socket|
  sockets.push socket

  socket.send Note.all(conn).to_json

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
      end
    end
  end

  # Handle disconnection and clean sockets
  socket.on_close do |_|
    sockets.delete(socket)
  end
end

Kemal.run
