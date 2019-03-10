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
var previousPillTaken
var boxToSend = 1
var start = false;
io.on('connection', function (socket) {
  socket.on('slot_lid', function (msg) {
    console.log('slot_lid' + msg)
  });
  socket.on('pill_presence', function (msg) {
    if (msg == '111111') { start = true }
    else if (msg == '000000') {
      // reset cycle
      start = false
      // 0 since it will be different on new cycle
      boxToSend = 0
    }

    console.log('previous pill' + previousPillTaken)
    console.log('pill_presence ' + msg)
    // if we are in cycle
    if (start) {
      if (previousPillTaken == null) {
        previousPillTaken = msg
      } else {
        //compare to see if difference
        if (msg != previousPillTaken) {
          boxToSend = (boxToSend % 6) + 1;
          previousPillTaken = msg
        } else {
          console.log("no difference from before")
        }
      }
    }
    console.log("in cycle " + start)
    console.log("pill to open " + (boxToSend) + ' \n')
  });
});
// ========================= Schedule =====================
// upon recieving, save into variable and set schedule
// job.nextInvocation() to get date that it is scheduled
var schedule = require('node-schedule');
// 0 - january, 11 - december
// var date = new Date(2019, 11, 21, 5, 30, 0);
// console.log(Date.now())
// let startTime = new Date(Date.now() + 5000);
// var morning = schedule.scheduleJob(startTime, function(){
//   console.log('Running at date ' + startTime);
// });

http.listen(port, function () {
  console.log('listening on *:' + port);
});


// Send medication details back
io.on('connection', function (socket) {
  socket.on('accData', function (data) {
    console.log('accData ' + data);
  });
});