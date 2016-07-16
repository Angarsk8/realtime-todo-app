require "kemal"
require "./app/lib/crud"

include CRUD

notes    = [] of String
sockets  = [] of HTTP::WebSocket

public_folder "src/public"

get "/" do |env|
  todos = notes.dup.map { |note_str|  JSON.parse(note_str) }
  render "src/views/home.ecr", "src/views/layout.ecr"
end

ws "/notes" do |socket|
  # Store the new connection in the sockets list
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
