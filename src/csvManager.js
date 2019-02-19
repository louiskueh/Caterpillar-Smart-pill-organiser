var fs = require('fs');
var path = require('path');
var csvWriter = require('csv-write-stream')
const csv = require('csvtojson')


class csvManager {

    constructor(type) {
        this.Path = path.basename(__dirname) + '/../resources/' + type + '.csv';
        this.type = type
        if (!fs.existsSync(this.Path)) {
            var header = this.setHeader(type)
            if (header == 0) { throw new Error("incorrect type!") };
            this.writer = csvWriter({ headers: header });
        }
        else
            this.writer = csvWriter({ sendHeaders: false });

        console.log("created csv Manager " + type + " successfuly!")
    }


    checkLogin(Username, Password, data) {
        for (var i = 0; i < data.length; i++) {
            if (Username == data[i].Username && Password == data[i].Password) {
                return { state: "Success", name: data[i].Name }
            }
        }
        return { state: "Fail", name: "" }
        // var result = data.map(item => (item.Username == Username && item.Password == Password) ? true : false)
        // console.log(result)
        // if (result.includes(true)) return true
        // else return false;
    }
    filterDataFromName(data, name) {
        var list = []
        for (var i = 0; i < data.length; i++) {
            if (name ==data[i].Name) {
                list.push(data[i])
                // return { state: "Success", name: data[i].Name }
            }
        }
        return list
    }

    async readCheckLogin(data) {
        console.log("Recieved login data: " + data.Username + ' | Password ' + data.Password + " |Name: ")
        // console.log("Reading data from " + 'resources/' + this.type + '.csv')

        csv()
            .fromFile(this.Path)
            .then((jsonObj) => {})
        // Async / await usage
        const jsonArray = await csv().fromFile(this.Path);
        // console.log(jsonArray)
        // console.log(this.checkLogin("user","pass",jsonArray))
        return this.checkLogin(data.Username, data.Password, jsonArray)
    }
    async readMedicationData(data) {
        console.log("Reading medication data for user " + data)
        csv()
            .fromFile(this.Path)
            .then((jsonObj) => {
            })

        // Async / await usage
        const jsonArray = await csv().fromFile(this.Path);
        console.log("Medication data" + JSON.stringify(jsonArray))
        // console.log(jsonArray)
        // console.log(this.checkLogin("user","pass",jsonArray))
        // return this.filterDataFromName(data.Name, jsonArray)
        return jsonArray

    }


    write(data) {
        var fileStream = fs.createWriteStream(this.Path, { flags: 'a' })
        fileStream.on('error', function (err) {
            console.log("Exception occured! Most likely xml file is in use")
            console.log(err);
            fileStream.end();
        });

        this.writer.pipe(fileStream);
        this.writer.write(data);
        this.writer.end();
    }

    setHeader(type) {
        var header = []
        switch (type) {
            case 'addMedication':
                header = [
                    'Name',
                    'Instruction',
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat',
                    'Sun',
                    'Morning',
                    'Afternoon',
                    'Night',
                    'Meal'
                ]
                break;
            case 'userDetails':
                header = [
                    'Username',
                    'Password',
                    'Name'
                ]
                break;
            case 'timeTaken':
                header = [
                    'Username',
                    'Timestamp',
                    'Day',
                    'BoxNo'
                ]
                break;
            case 'questions':
                header = [
                    'Name',
                    'Wake',
                    'Breakfast',
                    'Lunch',
                    'Dinner',
                    'Sleep'
                ]
                break;
            case 'watchInfo':
                header = [
                    'Username',
                    'accelX',
                    'accelY',
                    'accelZ',
                    'heartRate'
                ]
                break;
            default: console.log("type not found!")
                return 0;
        }
        return header;
    }



}
// csvManager = new csvManager('addMedication')
// try {
//    csvManager.readMedicationData("user").then(jsonArray => {
//     var list = csvManager.filterDataFromName(jsonArray,"medicationName")
//     console.log (list)
//    }) .catch((error) => {
//     console.log(error)
//   });
// }catch (error) {
//     console.log(error)
// }


// const test = {"Name" : "John" , "ID" : 1, }

// const records = { Name: 'medicationName2',Instruction: 'Instruction', Mon: false, Tue: true, Wed: false, 
// Thu: false, Fri: true, Sat:true, Sun: false, Morning :true, Afternoon : true, Night:false, Meal: true }
// csvManager.write(records)
// csvmanage = new csvManager("userDetails")
// const records = { Username: 'user', Password: 'pass' }
// // csvmanage.write(records)
// console.log(csvmanage.readCheckLogin(records))

// csvmanage = new csvManager("timeTaken")
// const records0 = { Username: 'user',Timestamp: '11:00:00', Day: '2', BoxNo: '1' }
// csvmanage.write(records0)


// csvmanage = new csvManager("questions")
// const records1 = { Username: 'user',Timestamp: '11:00:00', Day: '2', QuestionNo: '1' }
// csvmanage.write(records1)

// csvmanage = new csvManager("watchInfo")
// const records2 = { Username: 'user',accelX: '1',accelY: '1', accelZ :'1',heartRate: '2' }
// csvmanage.write(records2)


module.exports = csvManager;