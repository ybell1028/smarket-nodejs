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
            if (!(data == null || data == undefined)){
                res.status(500);
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
                        console.log('데이터 삽입됨.');
                        res.status(200);
                        res.json({ success: true });
                    })
                    .catch(err => {
                        console.dir(err);
                        res.status(500);
                        res.json({ success: false, message: err });
                    })
            }
        });
});


router.post('/login', function (req, res) {
    console.log('사용자 로그인 호출됨.');

    let body = req.body;
    let session = req.session;

    if(req.session.user){
        //이미 로그인 된 상태
        console.log("이미 로그인 되어 있음.")
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
                    res.status(500);
                    res.json({ success: false, message: 'password incorrect.' });
                }
            }).catch(err => {
                console.log('해당 아이디가 존재하지 않음. 로그인 실패.');
                console.log(err);
                res.status(500);
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
            res.json({ success: true, message: 'Your account has been logged out.' });
        });
    }
    else {
        //로그인 안된 상태
        console.log('아직 로그인되어 있지 않습니다.');
        res.json({ success: false, message: 'You are not logged in yet.' });
    }
});

module.exports = router;    