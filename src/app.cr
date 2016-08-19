require "kemal"
require "pg"

require "./app/models/*"

public_folder "src/public"

DB_PATH = "postgres://postgres:postgres@db:5432/notes_db"

db_conn = PG.connect DB_PATH
sockets = [] of HTTP::WebSocket

get "/" do
  render "src/views/layout.ecr"
end

ws "/notes" do |socket|
  sockets.push socket

  socket.send Note.all(db_conn).to_json

  # Handle incoming message and dispatch notes to all connected clients
  socket.on_message do |message|

    payload = JSON.parse(message).as_h

    # Handle message type to perform different CRUD operations
    case payload["type"]
    when "CREATE"
      Note.create_from(message).insert(db_conn)
    when "UPDATE"
      Note.create_from(message).update(db_conn)
    when "DELETE"
      Note.create_from(message).delete(db_conn)
    else
      next
    end

    # Broadcast all persisted notes back to each connected client
    sockets.each do |s|
      begin
        s.send Note.all(db_conn).to_json
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
