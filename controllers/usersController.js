var models = require("../models");
var util = require('../middleware/util');
var crypto = require('crypto');

exports.userList = (req, res) => {
    console.log('사용자 리스트 조회 호출됨.');
    models.user
        .findAll({
            attributes: ['user_id', 'name', 'nickname', 'phonenum']
        }).then((data) => { //ID 중복 검사
            if (data === null || data === undefined) {
                res.status(409);
                res.json(util.successFalse(null, 'DB에 레코드가 없음.'));
            }
            else {
                res.status(200);
                res.json(util.successTrue(data));
            }
        }).catch((err) => {
            console.log('사용자 리스트 조회 실패.');
            res.status(500);
            res.json(util.successTrue(err, '사용자 리스트 조회 실패.'));
        });
}

exports.userRegister = (req, res) => {
    let inputPassword = req.body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    models.user
        .create({
            user_id: req.body.user_id, //처음 가입할때는 넣어줘야함
            password: hashPassword,
            name: req.body.name,
            nickname: req.body.nickname,
            phonenum: req.body.phonenum,
            admin: req.body.admin,
            salt: salt
        })
        .then(function (data) {
            console.log('계정 데이터 삽입됨.');
            console.dir(data);
            res.status(201);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            console.log('계정 데이터 삽입 실패.');
            res.status(500)
            res.json(util.successFalse(err, '계정 데이터 삽입 실패.'));
        });
};

exports.userPasswordConfirm = async (req, res) => {
    console.log('사용자 비밀번호 인증 호출됨.');
    models.user
        .findOne({
            where: {user_id : req.body.user_id}
        }).then((data) => {
            let dbPassword = data.dataValues.password;
            let inputPassword = req.body.password;
            let salt = data.dataValues.salt;
            let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

            if (dbPassword === hashPassword) {
                console.log('비밀번호가 일치함.');
                console.log(data.dataValues.user_id + ' 비밀번호 인증됨.');
                res.status(200);
                res.json(util.successTrue());
            }
            else {
                res.status(409); // 409는 서버가 요청을 처리하는 과정에서 충돌이 발생한 경우입니다. (회원가입을 했는데 이미 사용하고 있는 아이디인 경우, 비밀번호가 틀린 경우 등)
                res.json(util.successFalse(null, '비밀번호가 틀립니다.'));
            }
        }).catch((err) => {
            console.log('사용자 비밀번호 인증 실패.');
            console.dir(err);
            res.status(500).json(util.successFalse(err, '사용자 비밀번호 인증 실패.'));
        });
};

exports.userDetail = (req, res) => { 
    console.log('사용자 정보 조회 호출됨.');
    models.user
        .findOne({
            attributes: ['user_id', 'name', 'nickname', 'phonenum'],
            where: {user_id : req.params.userid}
        }).then((data) => {
            res.status(200);
            res.json(util.successTrue(data));
        }).catch((err) => {
            console.log('사용자 정보 조회 실패.');
            console.dir(err);
            res.status(500).json(util.successFalse(err, '사용자 정보 조회 실패.'));
        });
};

exports.userModify = (req, res) => {
    console.log('사용자 정보 수정 호출됨.');
    //유저 정보 수정시 흐름
    //1. 유저가 확인창에 자신의 패스워드를 입력
    //2. 클라이언트는 userInfomation을 호출해서 비밀번호 제외한 데이터를 폼에 미리 입력해둠
    //3. 바꾸지 않을 데이터는 그대로 둘 것이고 바꾸지 않은 데이터 + 바뀐 데이터를 JSON으로 전송
    //4. 기존에 사용하던 access token 파기

    var newSalt = Math.round((new Date().valueOf() * Math.random())) + ""//salt를 다시 만들어줌.

    models.user
        .update({
            user_id : req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
            // PUT은 전체가 아닌 일부만 전달할 경우, 전달한 필드외 모두 null이 되버려서 넣어야함
            password : crypto.createHash("sha512").update(req.body.password + newSalt).digest("hex"),
            name : req.body.name,
            salt : newSalt,
            nickname: req.body.nickname,
            phonenum: req.body.phonenum
        },{
            where: {user_id : req.params.userid}
        }).then((data) => {
            res.status(200);
            res.json(util.successTrue());
        }).catch((err) => {
            console.log('사용자 정보 수정 실패.');
            console.dir(err);
            res.status(500).json(util.successFalse(err, '사용자 정보 수정 실패.'));
        });
};


exports.userWithdraw = (req, res) => {
    console.log('사용자 탈퇴 호출됨.');
    models.user
        .destroy({
            where: {user_id : req.params.userid}
        }).then((data) => {
            res.status(200);
            res.json(util.successTrue());
        }).catch((err) => {
            console.log('DB에서 사용자 정보 삭제 실패.');
            console.dir(err);
            res.status(500).json(util.successFalse(err, 'DB에서 사용자 정보 삭제 실패.'));
        });
};