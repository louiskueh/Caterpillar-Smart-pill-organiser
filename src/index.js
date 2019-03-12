var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SetInterval = require('set-interval')
var base64ToImage = require('base64-to-image');
var port = 65080;
var schedule = require('node-schedule');

var alertLevel = 1;

var previousPillTaken
var boxToSend = 1
var start = false;
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
function incrementAlert() {
  if (alertLevel != 5) {
    alertLevel = alertLevel + 1
    io.emit("alertLevel", alertLevel)
  }
  console.log("Alert Level is " + alertLevel)
}
function startNotification (){
  // send which box to open
  io.emit ("slot_to_open", boxToSend)
  console.log("Sending notification in 5 seconds")
  // after sending a new message, we start a notification that increases every 5 seconds
  SetInterval.start(incrementAlert, 5000, 'increaseAlertLevel')
}

io.on('connection', function (socket) {
  socket.on('new message', function (msg) {
    console.log('msg recieved: ' + msg);
    // io.emit ("slot_to_open", msg)
    // io.emit("slot_to_open", msg)
    let message = { "message": msg }
    io.emit('new message', message);

    // for now start notification once we send a chat msg
    startNotification()


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
  // if lid opened is wrong
  socket.on('wrong_slot', function (msg) {
    if (msg == "1") {
      io.emit("wrong_lid", "true")
      console.log("wrong lid opened!")
    }
    // correct = 1
    // wrong = 2 
  });
  socket.on('slot_lid', function (msg) {
    // TODO: When thy open wrong box
    // do on PI, when they open a slot without LED
    // console.log('slot_lid ' + msg)
  });
  socket.on('pill_presence', function (msg) {

    msg = String(msg).replace(/,/g, "");
    //repeater
    io.emit('pill_presence', { emptyState: msg })
    // console.log("repeated")
    if (msg == '1111') { start = true }
    else if (msg == '0000') {
      // reset cycle
      start = false
      // 0 since it will be different on new cycle
      boxToSend = 0
    }
    console.log('previous pill ' + previousPillTaken)
    console.log('pill_presence ' + msg)
    // if we are in cycle
    if (start) {
      if (previousPillTaken == null) {
        previousPillTaken = msg
      } else {
        //compare to see if difference
        if (msg != previousPillTaken) {
          // reset lights when pill is taken
          io.emit ("slot_to_open", "100")
          // Send message to app
          // when app recieved save data and write to file

          // timeTaken, questions, watchInfo
          sqlManager = require('./sqlManager.js');
          sqlManager = new sqlManager('timeTaken')
          var currentTime = new Date();
          var data = { Username: 'user', Timestamp: currentTime.toString(), BoxNo: boxToSend }

          //format { Timestamp: '11:00:00', Day: 'Monday', BoxNo: '1' }
          sqlManager.write(data)

          // send to machine learning
          data = {
            hour: (currentTime.getHours()).toString(), minute: (currentTime.getMinutes()).toString()
            , second: (currentTime.getSeconds()).toString()
          }

          io.emit("newTime", data)
          console.log("Send to newTime" + JSON.stringify(data))

          // update state
          boxToSend = (boxToSend % 4) + 1;
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


io.on('connection', function (socket) {
  socket.on('newAlertLevel', function (data) {
    alertLevel = data
    io.emit("alertLevel", alertLevel)
    console.log("received alert level")
  });
});




// Send medication details back
// io.on('connection', function (socket) {
//   socket.on('train_image', function (data) {
//     console.log('train_image ' + JSON.stringify(data));
//     var currentTime = new Date();
//     var optionalObj = {'fileName': currentTime.toString(), 'type':'jpeg'};
//     var path ='resources/faceImg/' + data.userID;
//     console.log(path)
//     base64ToImage( data.imageData,path,optionalObj); 
//     console.log("saved to image " + path )

//     // var img = new Image();
//     // img.src = 'data:image/jpeg;base64,' + data.imageData

//   });
// });