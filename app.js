var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cors = require('cors');
var util = require('./middleware/util');

/*라우터*/
var api = require('./routes/api');
/*라우터*/

var app = express();

//environment
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

//라우터 객체를 app 객체에 등록
app.use('/api', api);

/* sequelize setting */
const models = require("./models/index.js");

app.use(function(req, res, next) {
    res.status(404);
    res.json(util.successFalse(null, '404 Not Found'));
});

models.sequelize.sync().then(() => {
    console.log("DB 연결 성공");
}).catch(err => {
    console.log("연결 실패");
    console.log(err);
});
/* sequelize setting */

//서버 시작
http.createServer(app).listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다.');
    console.log('포트 : ' + app.get('port'));
});