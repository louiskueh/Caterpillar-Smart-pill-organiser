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
        var result = data.map(item => (item.Username == Username && item.Password == Password) ? true : false)
        console.log(result)
        if (result.includes(true)) return true
        else return false;
    }

    async readCheckLogin(data) {
        console.log("Reading data from " + 'resources/' + this.type + '.csv')
        csv()
            .fromFile(this.Path)
            .then((jsonObj) => {

            })

        // Async / await usage
        const jsonArray = await csv().fromFile(this.Path);
        console.log(jsonArray)
        console.log(this.checkLogin("user","pass",jsonArray))
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
            case 'userDetails':
                header = [
                    'Username',
                    'Password'
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
                    'Username',
                    'Timestamp',
                    'QuestionNo'
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

csvmanage = new csvManager("userDetails")
const records = { Username: 'user', Password: 'pass' }
// csvmanage.write(records)
console.log(csvmanage.readCheckLogin(records))

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