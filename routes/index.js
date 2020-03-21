var express = require('express');
var router = express.Router();
var models = require("../models");
var crypto = require('crypto');
var async = require('async');

//restful에서 생성
router.post('/register', function (req, res) {
    console.log('사용자 등록 호출됨.');

    let body = req.body;

    models.user
        .findOne({
            where: { user_id: body.id }
        })
        .then(function (data) { //ID 중복 검사
            if (!(data == null || data == undefined)) {
                res.status(409); // 409는 서버가 요청을 처리하는 과정에서 충돌이 발생한 경우입니다. (회원가입을 했는데 이미 사용하고 있는 아이디인 경우)
                res.json({ success: false, message: 'This ID already exists.' });
            }
            else {
                let inputPassword = body.password;

                let salt = Math.round((new Date().valueOf() * Math.random())) + "";
                let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

                models.user
                    .create({
                        user_id: body.id,
                        password: hashPassword,
                        name: body.name,
                        salt: salt
                    })
                    .then(function (data) {
                        console.dir(data);
                        console.log('계정 데이터 삽입됨.');
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
                where: { user_id: body.id }
            }).then(function (data) { // 레코드의 실제 값은 dataValues라는 프로퍼티 안에 있으
                let dbPassword = data.dataValues.password;
                let inputPassword = body.password;
                let salt = data.dataValues.salt;
                let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

                if (dbPassword == hashPassword) {
                    console.log('비밀번호가 일치함. 로그인 완료.');
                    //쿠키 설정
                    res.cookie("user_cookie", body.id, { // 첫번째 인자는 쿠키의 이름, 두번째 인자는 쿠키의 값
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
                    console.log('유저 세션 저장됨')
                    res.status(200);
                    res.json({ success: true, message: 'password correct.' });
                }
                else {
                    console.log('비밀번호 불일치. 로그인 실패.');
                    res.status(409);
                    res.json({ success: false, message: 'password incorrect.' });
                }
            }).catch(err => {
                console.log('해당 아이디가 존재하지 않음. 로그인 실패.');
                res.status(409);
                res.json({ success: false, message: 'invalid ID.' });
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

            console.log('세션을 삭제하고 로그아웃되었습니다.')
            res.status(200);
            res.json({ success: true, message: 'Your account has been logged out.' });
        });
    }
    else {
        //로그인 안된 상태
        console.log('아직 로그인되어 있지 않습니다.');
        res.status(401); //401은 로그인을 하지 않아 페이지를 열 권한이 없는 겁니다.
        res.json({ success: false, message: 'You are not logged in yet.' });
    }
});

router.get('/bookmark', function(req, res) { 
    // 초기유저에게 디폴드 폴더를 어떻게 제공할 것인가?
    // 1. 클라이언트에서 기본 폴더를 만들도록 유도하는 방법
    // 2. 실제 데이터베이스에 존재하진 않으나 클라이언트에서 처음 조회하면 만드는 방식
    console.log('북마크 조회 호출됨.');

    if(req.session.user){
        //로그인 된 상태
        console.dir(req.session);
        models.bookmark 
            .findAll({ //북마크 리스트 전체 조회
                where: {user_id: req.session.user.id}
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
        res.json({ success: false, message: 'You are not logged in yet.' });
    }
});


router.post('/bookmark', function(req, res) {
    console.log('북마크 생성 호출됨.');

    if(req.session.user){
        //로그인 된 상태
        console.dir(req.session);
        models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
            .create({
                user_id: req.session.user.id,
                list_name:req.body.listName,
                bookmark_name:req.body.bookmarkName,
                url: req.body.url
            })
            .then(data => {
                console.dir(data);
                console.log('북마크 생성 됨.');
                res.status(201); // 201은 새로운 컨텐츠 만들기에 성공했을 때 사용. POST 메소드에 대한 응답으로 잘 어울림.
                res.json({ success: true, message:"New bookmark list created." });
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
        res.json({ success: false, message: 'You are not logged in yet.' });
    }
});

module.exports = router;