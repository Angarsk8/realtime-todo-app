require "kemal"
require "./app/lib/crud"

include CRUD

notes    = [] of String
sockets  = [] of HTTP::WebSocket

public_folder "src/public"

get "/" do
  render "src/views/home.ecr", "src/views/layout.ecr"
end

ws "/notes" do |socket|
  # Send initial state to all connected clients and store the new connection
  socket.send notes.to_json
  sockets.push socket

  # Handle incoming message and dispatch notes to all connected clients
  socket.on_message do |msg|

    msg = JSON.parse(msg).as_h

    # Handle message type to perform CRUD like operations
    case msg["type"]
    when "CREATE"
      notes = create_note(msg.dup, notes.dup)
    when "UPDATE"
      notes = update_note(msg.dup, notes.dup)
    when "DELETE"
      notes = delete_note(msg.dup, notes.dup)
    else
      next
    end

    puts notes

    sockets.each do |s|
      s.send notes.to_json
    end
  end

  # Handle disconnection and clean sockets
  socket.on_close do |_|
    sockets.delete(socket)
    puts "Closing Socket: #{socket}"
  end
end

Kemal.run
