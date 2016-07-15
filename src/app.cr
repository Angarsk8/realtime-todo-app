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

  socket.send notes.to_json
  sockets.push socket

  socket.on_message do |msg|

    msg = JSON.parse(msg).as_h

    case msg["type"]
      when "CREATE"
        notes = create_note(msg.dup, notes.dup)
      when "UPDATE"
        notes = update_note(msg.dup, notes.dup)
      when "DELETE"
        notes = delete_note(msg.dup, notes.dup)
    end

    sockets.each do |s|
      s.send notes.to_json
    end
  end
end

Kemal.run
