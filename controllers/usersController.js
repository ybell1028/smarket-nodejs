var models = require("../models");
var util = require('../middleware/util');
var crypto = require('crypto');

exports.userList = (req, res) => {
    console.log('사용자 리스트 조회 호출됨.');
    models.user
        .findAll({
            attributes: ['user_id', 'name', 'nickname', 'phonenum']
        }).then((data) => { //ID 중복 검사
            if (data == null || data == undefined) {
                res.status(409);
                res.json(util.successFalse(null, 'DB에 레코드가 없음.'));
            }
            else {
                res.status(200);
                res.json(util.successTrue(data));
            }
        }).catch((err) => {
            console.log('DB에서 사용자 리스트 조회 실패');
            res.status(500);
            res.json(util.successTrue(err, 'DB에서 사용자 리스트 조회 실패'));
        });
}

exports.userRegister = async (req, res) => {
    console.log('사용자 등록 호출됨.');
    const registerValidation = await util.registerValidation(req, res);
    if (!registerValidation){
        console.log('사용자 등록 실패');
    }
    else {
        let inputPassword = req.body.password;
        let salt = Math.round((new Date().valueOf() * Math.random())) + "";
        let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
        models.user
            .create({
                user_id: req.body.user_id,
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
                console.log('계정 데이터 삽입중 에러.');
                res.status(500)
                res.json(util.successFalse(err));
            });
    }
};

exports.userPasswordConfirm = (req, res) => {
    console.log('사용자 비밀번호 인증 호출됨.');
    models.user
        .findOne({
            where: {user_id : req.decoded.user_id}
        }).then((data) => {
            let dbPassword = data.dataValues.password;
            let inputPassword = req.body.password;
            let salt = data.dataValues.salt;
            let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

            if (dbPassword === hashPassword) {
                console.log('비밀번호가 일치함.');
                console.log(data.dataValues.user_id + ' 비밀번호 인증됨.');
                res.status(200);
                res.json(util.successTrue(null));
            }
            else{
                res.status(409); // 409는 서버가 요청을 처리하는 과정에서 충돌이 발생한 경우입니다. (회원가입을 했는데 이미 사용하고 있는 아이디인 경우, 비밀번호가 틀린 경우 등)
                res.json(util.successFalse(null, '비밀번호가 틀립니다.'));
            }
        }).catch((err) => {
            console.log('DB에서 사용자 정보 조회 실패');
            console.dir(err);
            res.status(500).json(util.successFalse(err, 'DB에서 사용자 정보 조회 실패'));
        });
}

exports.userDetail = (req, res) => {
    console.log('사용자 정보 조회 호출됨.');
    console.log(req.params.userid);
    models.user
        .findOne({
            where: {user_id : req.params.userid}
        }).then((data) => {
            res.status(200);
            res.json(util.successTrue(data));
        }).catch((err) => {
            console.log('DB에서 사용자 정보 조회 실패');
            console.dir(err);
            res.status(500).json(util.successFalse(err, 'DB에서 사용자 정보 조회 실패'));
        });
}

//done


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
            user_id : req.decoded.user_id, // 얘는 절대 바뀌면 안됨
            salt : newSalt,
            password : crypto.createHash("sha512").update(req.body.password + newSalt).digest("hex"),
            name : req.body.name
        },{
            where: {user_id : req.decoded.user_id}
        }).then((data) => {
            res.status(200);
            res.json(util.successTrue(data));
        }).catch((err) => {
            console.log('DB에서 사용자 정보 수정 실패');
            console.dir(err);
            res.status(500).json(util.successFalse(err, 'DB에서 사용자 정보 수정 실패'));
        });
}


exports.userWithdraw = (req, res) => {
    console.log('사용자 탈퇴 호출됨.');
    models.user
        .findOneAndRemove({
            where: {user_id : req.params.userid}
        }).then((data) => {
            res.status(200);
            res.json(util.successTrue(data));
        }).catch((err) => {
            console.log('DB에서 사용자 정보 삭제 실패');
            console.dir(err);
            res.status(500).json(util.successFalse(err, 'DB에서 사용자 정보 삭제 실패'));
        });
}