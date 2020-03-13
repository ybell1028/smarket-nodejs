var express = require('express'),
http = require('http'),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
cors = require('cors');

/*라우터*/
var index = require('./routes/index');
var naverApi = require('./routes/api/naver/index');
/*라우터*/

var app = express();

//environment
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret:'my key',
    resave:false,
    saveUninitialized:true,
    cookie: {
        maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
    }
}));


//라우터 객체를 app 객체에 등록
app.use('/', index);
app.use('/naver', naverApi);


/* sequelize setting */
const models = require("./models/index.js");

models.sequelize.sync().then(() => {
    console.log("DB 연결 성공");
}).catch(err => {
    console.log("연결 실패");
    console.log(err);
});
/* sequelize setting */

//서버 시작
http.createServer(app).listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
});