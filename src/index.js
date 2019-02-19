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

// receiving data to save from phone/pi
io.on('connection', function (socket) {
  socket.on('data', function (data) {
    console.log('Incoming data' + data.toString());
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

// Authenticate login
io.on('connection', function (socket) {
  socket.on('login', function (data) {
    console.log('Incoming data');
    try {
      // timeTaken, questions, watchInfo
      csvManager = require('./csvManager.js');
      csvManager = new csvManager(data.type)
      // var checkLogin = 
      // console.log(checkLogin)
      
      csvManager.readCheckLogin(data.data).then(object => {
        success = object.state
        name = object.name
        console.log("Name: " + name)
        let objectWrapper = { "Success": success, "Name" :name }
        console.log("Sending over socket IO login Auth : " + objectWrapper.Success + " name:" + objectWrapper.Name)
        io.emit('LoginAuth', objectWrapper);
      })
    } catch (error) {
      console.log(error)
    }
  });
});


// Send medication details back
io.on('connection', function (socket) {
  socket.on('requireMedication', function (data) {
    console.log('Incoming medication for user ' + data );
    try {
      // timeTaken, questions, watchInfo
      csvManager = require('./csvManager.js');
      csvManager = new csvManager("addMedication")
      csvManager.filterDataFromName(data.Name).then(filteredData => {
        io.emit('medicationDetails', filteredData);
      }).catch((error) => {
        console.log(error)
      });
    } catch (error) {
      console.log(error)
    }
  });
});


// TODO: Receive stuff from raspberry PI and send to phone


http.listen(port, function () {
  console.log('listening on *:' + port);
});


