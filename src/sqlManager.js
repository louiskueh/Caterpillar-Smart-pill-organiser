var fs = require('fs');
var path = require('path');


var sqlite3 = require('sqlite3').verbose();


class sqlManager {

    createTable() {
        var self = this;
        this.db.serialize(function () {
            var headers = self.setHeader(self.type)
            console.log("Headers " + headers)
            var createTable = "CREATE TABLE + " + self.type + " (";
            for (var x in headers) {
                createTable = createTable.concat(x + " string,")
            }
            createTable = createTable.concat(");")
            console.log(createTable)

            // var stmt = this.db.prepare("INSERT INTO lorem VALUES (?)");
            // for (var i = 0; i < 10; i++) {
            //     stmt.run("Ipsum " + i);
            // }
            // stmt.finalize();

            // this.db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
            //     console.log(row.id + ": " + row.info);
            // });
        });
    }

    constructor(type) {
        this.Path = path.basename(__dirname) + '/../resources/storage.csv';
        this.type = type
        this.db = new sqlite3.Database("resources/storage.db");

        this.createTable()

    }


    checkLogin(Username, Password, data) {
        for (var i = 0; i < data.length; i++) {
            if (Username == data[i].Username && Password == data[i].Password) {
                return { state: "Success", name: data[i].Name, caregiver: data[i].Caregiver }
            }
        }
        return { state: "Fail", name: "", caregiver: "" }
        // var result = data.map(item => (item.Username == Username && item.Password == Password) ? true : false)
        // console.log(result)
        // if (result.includes(true)) return true
        // else return false;
    }
    filterDataFromName(data, name) {
        var list = []
        for (var i = 0; i < data.length; i++) {
            if (name == data[i].User) {
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
            .then((jsonObj) => { })
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
                    'User',
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
                    'Name',
                    'Caregiver'
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
sqlManager = new sqlManager("questions")

module.exports = sqlManager;