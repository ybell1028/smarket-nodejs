const express = require('express');
const http = require('http');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cluster = module.exports = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_RR;
const cors = require('cors');
const numCPUs = require('os').cpus().length;
const util = require('./middleware/util');

/*라우터*/
const api = require('./routes/api');
/*라우터*/

const app = express();

//environment
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//라우터 객체를 app 객체에 등록
app.use('/api', api);

/* sequelize setting */
const models = require("./models/index.js");

app.use(function (req, res, next) {
    res.status(404);
    res.json(util.successFalse({
        name: '404 Not Found'
    }, '404 Not Found'));
});

models.sequelize.sync().then(() => {
}).catch(err => {
    console.log("연결 실패");
    console.log(err);
});

let server = http.createServer(app);

// let ip = '192.168.0.2'; 

// 멀티 스레드
/* cluster(multithread) setting */

// if (cluster.isMaster) {

//     for (let i = 1; i <= numCPUs; i++) {
//         console.log('worker process create[' + i + ']');
//         cluster.fork();
//     }

//     cluster.on('listening', function(worker, address) {
//         console.log("Worker " + worker.id + " is now connected to " + address.address + ":" + address.port);
//     });

//     cluster.on('exit',function(worker, code, signal){
//         console.log(`worker ${worker.process.pid} died`);
//         cluster.fork();
//     });

// } else {
//     server.listen(app.get('port'), ip, function () {
//         console.log('slave server '+ cluster.worker.process.pid);
//     });
//     console.log('ip : ' + ip + ' | port : ' + app.get('port'));
//     console.log('server is running');
// }


// 싱글 스레드

server.listen(app.get('port'), function () {
    // console.log('ip : ' + ip + ' | port : ' + app.get('port'));
    console.log('server is running');
});

server.on('connection', function (socket) {
    console.log('클라이언트가 접속했습니다.');
});