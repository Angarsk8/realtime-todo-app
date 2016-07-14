require "kemal"

messages = [] of String
sockets = [] of HTTP::WebSocket
i = 0

public_folder "src/public"

get "/" do
  render "src/views/home.ecr", "src/views/layout.ecr"
end

ws "/" do |socket|

  socket.send messages.to_json

  sockets.push socket

  socket.on_message do |message|

    _message = {} of String => String
    JSON.parse(message).each do |key, value|
      _message[key.to_s] = value.to_s.capitalize
    end
    _message["created_at"] = "#{Time.now}"
    _message["id"] = "#{i + 1}"

    message = _message.to_json
    messages.push message

    sockets.each do |a_socket|
      a_socket.send messages.to_json
    end
  end
end

Kemal.run
