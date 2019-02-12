var fs = require('fs');
var path = require('path');
var csvWriter = require('csv-write-stream')

class csvManager {
    constructor(type) {
        this.Path = path.basename(__dirname) + '/../resources/' + type + '.csv';

        if (!fs.existsSync(this.Path)) {
            var header = this.setHeader(type)
            if (header == 0) { throw "incorrect type!" };
            this.writer = csvWriter({ headers: header });
        }
        else
           this.writer = csvWriter({ sendHeaders: false });

        console.log("created csv writer for " + type + " successfuly!")
    }
    write(data) {
        this.writer.pipe(fs.createWriteStream(this.Path, { flags: 'a' }));
        this.writer.write(data);
        this.writer.end();
    }

    setHeader(type) {
        var header = []
        switch (type) {
            case 'timeTaken':
                header = [
                    'Timestamp',
                    'Day',
                    'BoxNo'
                ]
                break;
            case 'questions':
                header = [
                    'Timestamp',
                    'QuestionNo'
                ]
                break;
            case 'watchInfo':
                header = [
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

// csvmanage = new csvManager("timeTaken")
// const records = { Timestamp: '11:00:00', Day: 'Monday', BoxNo: '1' }
// csvmanage.write(records)

csvmanage = new csvManager("questions")
const records1 = { Timestamp: '11:00:00', Day: '2', BoxNo: '1' }
csvmanage.write(records1)

csvmanage = new csvManager("watchInfo")
const records2 = { accelX: '1',accelY: '1', accelZ :'1',heartRate: '2' }
csvmanage.write(records2)


