var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
csvManager = require('./csvManager.js');
var port = 65080;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('new message', function(msg){
    console.log('msg recieved: ' + msg);
    let message = {"message":msg}
    io.emit('new message', message);
  });
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
});

// receiving data from phone/pi
io.on('connection', function(socket){
  console.log('Incoming data');
  socket.on('data', function(data){
    //store data
    // timeTaken, questions, watchInfo
    csvManager = new csvManager(data.type)
    //format { Timestamp: '11:00:00', Day: 'Monday', BoxNo: '1' }
    csvManager.write(data.data)
  });
});




http.listen(port, function(){
  console.log('listening on *:' + port);
});


