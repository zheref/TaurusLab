const http = require('http');
const { parse } = require('querystring');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

class LogStore {

    constructor() {
        this.fileName = "log.txt";
    }

    writeIntoCSVLine(text) {
        fs.readFile(this.fileName, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                throw err;
            }

            fs.writeFile(this.fileName, data + text + "\n", function(err) {
                if (err) {
                    console.log(err);
                    throw err;
                }

                console.log("The file was saved!");
            });
        });
    }

    readCSVFile(callback) {
        fs.readFile(this.fileName, (err, data) => {
            if (err) {
                console.log(err);
                throw err;
            }

            console.log(data);
            callback(data);
        });
    }

}

const server = http.createServer((req, res) => {
    const logger = new LogStore();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(
                parse(body)
            );
            let content = parse(body);
            content["timestamp"] = Date();
            logger.writeIntoCSVLine(JSON.stringify(content));
            res.end('ok');
        });
    } else if (req.method === 'GET') {
        req.on('data', chunk => {});
        req.on('end', () => {
            logger.readCSVFile((text) => {
                res.end(text);
            });
        });
    }
});

server.listen(port, hostname, () => {
    var logger = new LogStore();
    logger.writeIntoCSVLine("Started at " + Date());
    console.log(`Server running at http://${hostname}:${port}/`);
});

