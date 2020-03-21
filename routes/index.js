var express = require('express');
var querystring = require('querystring');
var router = express.Router();
var models = require("../models");
var crypto = require('crypto');
var async = require('async');

//restful에서 생성
router.post('/register', function (req, res) {
    console.log('사용자 등록 호출됨.');
    //body에 입력해야하는 JSON 포맷
    //1)userid(이번에 변경), 2)password, 3)name
    let body = req.body;

    models.user
        .findOne({
            where: { user_id: body.userid }
        })
        .then(function (data) { //ID 중복 검사
            if (!(data == null || data == undefined)) {
                res.status(409); // 409는 서버가 요청을 처리하는 과정에서 충돌이 발생한 경우입니다. (회원가입을 했는데 이미 사용하고 있는 아이디인 경우)
                res.json({ success: false, message: '이 ID는 이미 사용중입니다.' });
            }
            else {
                let inputPassword = body.password;

                let salt = Math.round((new Date().valueOf() * Math.random())) + "";
                let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

                models.user
                    .create({
                        user_id: body.userid,
                        password: hashPassword,
                        name: body.name,
                        salt: salt
                    })
                    .then(function (data) {
                        console.log('계정 데이터 삽입됨.');
                        console.dir(data);
                    })
                    .catch(err => {
                        console.dir(err);
                        res.status(500);
                        res.json({ success: false, message: err });
                    });

                res.status(201); // 201은 새로운 컨텐츠 만들기에 성공했을 때 사용. POST 메소드에 대한 응답으로 잘 어울림.
                res.json({ success: true });
            }
        }).catch(err => {
            console.log('DB에서 ID 조회 실패');
            console.log(err);
            res.status(500);
            res.json({ success: false, message: err });
        });
});


router.post('/login', function (req, res) {
    console.log('사용자 로그인 호출됨.');
    //body에 입력해야하는 JSON 포맷
    //1)userid(이번에 변경), 2)password

    let body = req.body;

    if(req.session.user){
        //이미 로그인 된 상태
        console.log("이미 로그인 되어 있음.");
        res.status(409);
        res.json({ success: false, message: err });
    }
    else {
        models.user
            .findOne({
                where: { user_id: body.userid }
            }).then(function (data) { // 레코드의 실제 값은 dataValues라는 프로퍼티 안에 있으
                let dbPassword = data.dataValues.password;
                let inputPassword = body.password;
                let salt = data.dataValues.salt;
                let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

                if (dbPassword == hashPassword) {
                    console.log('비밀번호가 일치함.');
                    console.log( data.dataValues.user_id + ' 로그인 완료.');
                    //쿠키 설정
                    res.cookie("user_cookie", body.userid, { // 첫번째 인자는 쿠키의 이름, 두번째 인자는 쿠키의 값
                        //세번째 인자는 옵션
                        expires: new Date(Date.now() + 900000),
                        httpOnly: true
                    });
        
                    //세션 저장
                    req.session.user = {
                        id: data.dataValues.user_id,
                        name : data.dataValues.name,
                        authorized: true
                    };
                    console.log('유저 세션 저장됨.')
                    console.dir(req.session);
                    res.status(200);
                    res.json({ success: true, message: '로그인 성공.' });
                }
                else {
                    console.log('비밀번호 불일치. 로그인 실패.');
                    res.status(409);
                    res.json({ success: false, message: '패스워드 불일치. 로그인 실패.' });
                }
            }).catch(err => {
                console.log('해당 아이디가 존재하지 않음. 로그인 실패.');
                res.status(409);
                res.json({ success: false, message: 'ID가 존재하지 않음. 로그인 실패.' });
            })
    }
});

router.get('/logout', function(req,res) {
    console.log('사용자 로그아웃 호출됨.');

    if(req.session.user){
        //로그인 된 상태
        console.log('로그아웃합니다.');

        req.session.destroy(function(err){
            if(err) {throw err;}

            console.log('세션을 삭제하고 로그아웃되었습니다.');
            res.status(200);
            res.json({ success: true, message: '계정이 로그아웃 되었습니다.' });
        });
    }
    else {
        //로그인 안된 상태
        console.log('아직 로그인되어 있지 않습니다.');
        res.status(401); //401은 로그인을 하지 않아 페이지를 열 권한이 없는 겁니다.
        res.json({ success: false, message: '아직 로그인하지 않았습니다.' });
    }
});


router.post('/bookmark/:userid', function(req, res) {
    console.log('북마크 생성 호출됨.');
    console.log('id : ' + req.params.userid + ' listname : ' + req.body.listname);
    //1. id는 URL에 명시 -> ex) http://localhost:3000/bookmark/ybell1028
    //2. body에 입력해야하는 JSON 포맷
    //1)userid 2)listname 3)bookmarkname 4)url
    if(req.session.user){
        //로그인 된 상태
        models.bookmark
            .create({
                user_id: req.params.userid,
                list_name: req.body.listname,
                bookmark_name:req.body.bookmarkname,
                url: req.body.url
            })
            .then(data => {
                console.log('북마크 생성됨.');
                console.dir(data);
                res.status(201); // 201은 새로운 컨텐츠 만들기에 성공했을 때 사용. POST 메소드에 대한 응답으로 잘 어울림.
                res.json({ success: true, message:"새로운 북마크가 생성되었습니다." });
            })
            .catch(err => {
                console.dir(err);
                res.status(500);
                res.json({ success: false, message: err });
            });
    }
    else {
        //로그인 안된 상태
        console.log('아직 로그인되어 있지 않습니다.');
        res.status(401); //401은 로그인을 하지 않아 페이지를 열 권한이 없는 겁니다.
        res.json({ success: false, message: '아직 로그인하지 않았습니다.' });
    }
});


router.get('/bookmark/:userid', function(req, res) {
    //1. id는 URL에 명시 -> ex) http://localhost:3000/bookmark/ybell1028
    //2. POST외의 GET, PUT, DELETE 메소드는 body를 보낼 필요가 없습니다.(JSON 형식으로 안보내줘도 된다는거)
    //3. 위 URL에 ?뒤 쿼리스트링을 붙혀야함. -> ex)http://localhost:3000/bookmark/ybell1028?listname=%EA%B8%B0%EB%B3%B8%20%EB%B6%81%EB%A7%88%ED%81%AC
    //4. 만드는 방법은 ?뒤에 변수이름=변수 값인데 변수 값은 인코딩 해줘야함
    //5. 인코딩 하는 방법은 http://localhost:3000/bookmark/ybell1028?listname=스트리머 <-일때 스트리머 부분을 드래그해서 오른쪽 마우스 > EncodeURIcomponent 클릭
    console.log('북마크 조회 호출됨.');

    var queryListname = querystring.unescape(req.query.listname);
    //url에는 한글을 지원하지 않기때문에 인코딩된 url을 쿼리스트링 모듈로 해석해서 사용

    console.log("디코드 된 lisname = " + queryListname);

    console.log('userid : ' + req.params.userid + ', list_name : ' + queryListname);

    if(req.session.user){
        //로그인 된 상태
        models.bookmark
            .findAll({ //북마크 리스트 전체 조회
                where: {
                    user_id: req.params.userid,
                    list_name: queryListname
                }
            })
            .then(function (data) {
                console.dir(data);
                console.log('북마크 리스트 조회 완료.');
                res.status(200);
                res.json(data);
            })
            .catch(err => {
                console.dir(err);
                res.status(500);
                res.json({ success: false, message: err });
            });
    }
    else {
        //로그인 안된 상태
        console.log('아직 로그인되어 있지 않습니다.');
        res.status(401); //401은 로그인을 하지 않아 페이지를 열 권한이 없는 겁니다.
        res.json({ success: false, message: '아직 로그인하지 않았습니다.' });
    }
});


router.delete('/bookmark/:userid', function(req, res) {
    console.log('북마크 폴더 삭제 호출됨.');

    var queryListname = querystring.unescape(req.query.listname);
    //url에는 한글을 지원하지 않기때문에 인코딩된 url을 쿼리스트링 모듈로 해석해서 사용

    console.log('userid : ' + req.params.userid + ', list_name : ' + queryListname);

    if(req.session.user){
        //로그인 된 상태
        models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
            .destroy({
                where:{ 
                    user_id: req.params.userid,
                    list_name: queryListname
                }
            })
            .then(data => {
                console.dir(data);
                console.log('북마크 폴더 [' + queryListname + '] 삭제됨.');
                res.status(200);
                res.json({ success: true, message: "[" + queryListname + "]" + " 북마크 폴더 삭제됨." });
            })
            .catch(err => {
                console.dir(err);
                res.status(500);
                res.json({ success: false, message: err });
            });
    }
    else {
        //로그인 안 된 상태
        console.log('아직 로그인되어 있지 않습니다.');
        res.status(401); //401은 로그인을 하지 않아 페이지를 열 권한이 없는 겁니다.
        res.json({ success: false, message: '아직 로그인하지 않았습니다.' });
    }
});


router.delete('/bookmark/:userid/:id', function(req, res) {
    console.log('개별 북마크 삭제 호출됨.');
    //id는 primary key -> unique하므로 중복되는 일이 없음.이 값만으로 어떤 북마크인지 식별 가능

    if(req.session.user){
        //로그인 된 상태
        models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
            .destroy({
                where:{
                    id: req.params.id // userid와 혼동하지 말것
                }
            })
            .then(data => {
                console.dir(data);
                console.log('북마크 삭제됨.');
                res.status(200);
                res.json({ success: true, message: "북마크 삭제됨." });
            })
            .catch(err => {
                console.dir(err);
                res.status(500);
                res.json({ success: false, message: err });
            });
    }
    else {
        //로그인 안 된 상태
        console.log('아직 로그인되어 있지 않습니다.');
        res.status(401); //401은 로그인을 하지 않아 페이지를 열 권한이 없는 겁니다.
        res.json({ success: false, message: '아직 로그인하지 않았습니다.' });
    }
});

module.exports = router;