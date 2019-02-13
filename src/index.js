var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 65080;
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('new message', function (msg) {
    console.log('msg recieved: ' + msg);
    let message = { "message": msg }
    io.emit('new message', message);
  });
  
});


io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

// receiving data from phone/pi
io.on('connection', function (socket) {
  socket.on('data', function (data) {
    console.log('Incoming data');
    try {
      // timeTaken, questions, watchInfo
      csvManager = require('./csvManager.js');
      csvManager = new csvManager(data.type)
      //format { Timestamp: '11:00:00', Day: 'Monday', BoxNo: '1' }
      csvManager.write(data.data)

    } catch (error) {
      console.log(error)
    }


  });
});




http.listen(port, function () {
  console.log('listening on *:' + port);
});


