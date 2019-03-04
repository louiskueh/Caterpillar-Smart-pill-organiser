var fs = require('fs');
var path = require('path');


var Database = require('better-sqlite3');


class sqlManager {

    createTable(type) {
        var self = this;
        var createTable
        this.db.serialize(function () {
            var headers = self.setHeader(type)
            console.log("Headers " + headers)
            createTable = "CREATE TABLE " + type + " (";
            for (var i = 0; i < headers.length; i++) {
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

    constructor(type, filename = "storage") {
        this.type = type
        console.log(filename)
        // storage
        // test
        this.db = new Database("resources/" + filename + ".db", { verbose: console.log });
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
    readCheckLogin(data) {
        console.log("Recieved login data: " + data.Username + ' | Password ' + data.Password + " |Name: ")
        const stmt = this.db.prepare('SELECT * FROM userDetails WHERE Username=? AND Password=?;');
        const result = stmt.all('user', 'password');
        if (result.length == 0) {
            return { state: "Fail", name: "", caregiver: "" }
        }
        else if (result.length == 1) {
            return { state: "Success", name: result[0].Name, caregiver: result[0].Caregiver }
        }
        else {
            console.log("Multiple similar entries")
        }
    }
    readMedicationData(data) {
        console.log("Reading medication data for user " + data)
        const stmt = this.db.prepare('SELECT * FROM addMedication WHERE User=? ;');
        const result = stmt.all(data);
        if (result.length >= 1) {
            return result;
        }
        console.log("No entires for user" + data)
    }


    write(data) {


        var insertTable = "INSERT INTO " + this.type + " (";
        // setup columns
        Object.keys(data).forEach(function (key) {
            insertTable = insertTable.concat(key + ",")
        });
        insertTable = insertTable.slice(0, -1);
        insertTable = insertTable.concat(") VALUES (")
        // add values
        Object.keys(data).forEach(function (key) {
            insertTable = insertTable.concat("'" + data[key] + "'" + ",")

        });
        insertTable = insertTable.slice(0, -1);
        insertTable = insertTable.concat(");")
        // console.log(createTable)
        const stmt = this.db.prepare(insertTable);
        const info = stmt.run();
        console.log("Inserted into table with query " + insertTable + " info :" + JSON.stringify(info));
        this.db.close()

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
// sqlManager = new sqlManager("addMedication", "test")
// console.log(sqlManager.readMedicationData("user"))
// var res = sqlManager.readCheckLogin({Username: 'user', Password: 'password'})

// console.log(JSON.stringify(res))
// sqlManager = new sqlManager("questions", "test")
// var tables = ['addMedication','userDetails','timeTaken','questions','watchInfo' ]
// for (var i = 0 ; i < tables.length; i ++) {
//     sqlManager.createTable(tables[i])
// }
// sqlManager.db.close();

// sqlManager = new sqlManager("userDetails", "test")
// const records = { Username: 'user2', Password: 'pass2', Name: "name2", Caregiver: "careGiver2" }
// sqlManager.write(records)


// const records = { User: 'user', Name: 'medicationName2',Instruction: 'Instruction', Mon: false, Tue: true, Wed: false, 
// Thu: false, Fri: true, Sat:true, Sun: false, Morning :true, Afternoon : true, Night:false, Meal: true }
// sqlManager = new sqlManager("addMedication","test")
// sqlManager.write(records)
module.exports = sqlManager;