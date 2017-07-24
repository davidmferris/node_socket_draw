require('newrelic');

var express = require('express'),
    app     = express(),
    http    = require('http').Server(app),
    io      = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('point drawn', function(msg){
    io.emit('point drawn', msg);
  });
});

http.listen(process.env.PORT || 5000, function() {
  console.log('listing on 8080');
});
