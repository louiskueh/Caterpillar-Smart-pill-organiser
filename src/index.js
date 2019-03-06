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
    io.emit("slot_to_open", msg)
    let message = { "message": msg }
    io.emit('new message', message);
 
    console.log("sent slot to open to" + message)
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
    console.log('Incoming data' + JSON.stringify(data));
    try {
      // timeTaken, questions, watchInfo
      sqlManager = require('./sqlManager.js');
      sqlManager = new sqlManager(data.type)
      //format { Timestamp: '11:00:00', Day: 'Monday', BoxNo: '1' }
      sqlManager.write(data.data)

    } catch (error) {
      console.log(error)
    }
  });
});

// Authenticate login
io.on('connection', function (socket) {
  socket.on('login', function (data) {
    console.log('Incoming data');
    // timeTaken, questions, watchInfo
    sqlManager = require('./sqlManager.js');
    sqlManager = new sqlManager(data.type)
    var res = sqlManager.readCheckLogin(data.data)
    io.emit('LoginAuth', res)
    console.log("Sending over auth " + JSON.stringify(res))

  });
});


// Send medication details back
io.on('connection', function (socket) {
  socket.on('queryMed', function (name) {
    console.log('Incoming medication for user ' + name);
    // timeTaken, questions, watchInfo
    sqlManager = require('./sqlManager.js');
    sqlManager = new sqlManager("addMedication")
    var res = sqlManager.readMedicationData(name)
    console.log("Medication response " + JSON.stringify(res))
    io.emit("responseMed", res)
  });
});


// TODO: Receive stuff from raspberry PI and send to phone
// send to you
// 'pill_slot'

// 'slot_opened' : true / false 
// 'pill'  : present/ taken
// Send medication details back
io.on('connection', function (socket) {
  socket.on('slot_lid', function (msg) {
    console.log ( 'slot_lid' + msg)
  });
  socket.on('pill_presence', function (msg) {
    console.log ( 'pill_presence' + msg)
  });


});

http.listen(port, function () {
  console.log('listening on *:' + port);
});


