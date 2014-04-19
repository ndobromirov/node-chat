var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var messages = [];

io.sockets.on('connection', function (socket) {
  socket.emit('chat-history', {messages: messages});
  
  socket.on('post-message', function(data){
    var messageData = {time: new Date(), user: data.username, text: data.text};
    messages.push(messageData);

    io.sockets.clients().forEach(function(_socket){
      _socket.emit('new-message', {message: messageData});
    });
  });
});
