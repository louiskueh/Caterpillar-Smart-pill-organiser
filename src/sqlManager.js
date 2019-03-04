var fs = require('fs');
var path = require('path');


var sqlite3 = require('sqlite3').verbose();


class sqlManager {

    createTable(type) {
        var self = this;
        var createTable
        this.db.serialize(function () {
            var headers = self.setHeader(type)
            console.log("Headers " + headers)
            createTable = "CREATE TABLE " + type + " (";
            for (var i = 0; i< headers.length; i++) {
                createTable = createTable.concat(headers[i] + " string,")
            }
            // get rid of trailing commar
            createTable = createTable.slice(0, -1); 
            createTable = createTable.concat(");")
            // console.log(createTable)
            self.db.run(createTable);
        });

        console.log("Created table with query: " + createTable)
        // remember to close after!
    }

    constructor(type, filename) {
        this.Path = path.basename(__dirname) + '/../resources/storage.csv';
        this.type = type
        // storage
        // test
        this.db = new sqlite3.Database("resources/" + filename + ".db");
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
        this.db
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
        var self = this
        this.db.serialize(function () {
     
            var insertTable = "INSERT INTO " + self.type + " (";
            // setup columns
            Object.keys(data).forEach(function(key) {
                insertTable = insertTable.concat(key + ",")
            });
            insertTable = insertTable.slice(0, -1); 
            insertTable = insertTable.concat(") VALUES (")
            // add values
            Object.keys(data).forEach(function(key) {
                insertTable = insertTable.concat("'" + data[key] + "'" + ",")

            });
            insertTable = insertTable.slice(0, -1); 
            insertTable = insertTable.concat(");")
            // console.log(createTable)
            self.db.run(insertTable);
            console.log("Inserted into table with query " + insertTable);
            // var stmt = self.db.prepare(insertTable);
            // for (var i = 0; i < 10; i++) {
            //     stmt.run("Ipsum " + i);
            // }
            // stmt.finalize();
        });
        this.db.close()


        // var fileStream = fs.createWriteStream(this.Path, { flags: 'a' })
        // fileStream.on('error', function (err) {
        //     console.log("Exception occured! Most likely xml file is in use")
        //     console.log(err);
        //     fileStream.end();
        // });

        // this.writer.pipe(fileStream);
        // this.writer.write(data);
        // this.writer.end();
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
// sqlManager = new sqlManager("questions", "test")
// var tables = ['addMedication','userDetails','timeTaken','questions','watchInfo' ]
// for (var i = 0 ; i < tables.length; i ++) {
//     sqlManager.createTable(tables[i])
// }
// sqlManager.db.close();
var tableName = "userDetails"
sqlManager = new sqlManager(tableName,"test")
const records = { Username: 'user', Password: 'pass', Name: "name", Caregiver: "careGiver" }
sqlManager.write(records)
// user reg

module.exports = sqlManager;