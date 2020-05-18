var models = require("../models");
var util = require('../middleware/util');
var jwt = require('jsonwebtoken');
var jwtConfig = require("../config/jwt");
var crypto = require('crypto');

exports.login = async (req, res) => {
    console.log('회원 로그인 호출됨.');
    models.user
        .findOne({
            where: { user_id: req.body.user_id }
        }).then(async function (data) {
            let dbPassword = data.dataValues.password;
            let inputPassword = req.body.password;
            let salt = data.dataValues.salt;
            let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

            req.body.admin = data.dataValues.admin;

            if (dbPassword === hashPassword) {
                console.log('비밀번호가 일치함.');
                console.log(data.dataValues.user_id + ' 로그인 성공.');
                var tokens = {
                    accessToken: await util.generateAccessToken(req, res),
                    refreshToken: await util.generateRefreshToken(req, res)
                }
                console.log('토큰 생성됨.\n');
                res.cookie('accessToken', tokens.accessToken, {
                    expires: new Date(Date.now() + tokens.accessToken.expiresIn),
                    secure: true,
                    httpOnly: true
                });
                res.cookie('refreshToken', tokens.refreshToken, {
                    expires: new Date(Date.now() + tokens.refreshToken.expiresIn),
                    secure: true,
                    httpOnly: true
                });
                res.status(200);
                res.json(util.successTrue(tokens));
            }
            else {
                console.log('비밀번호 불일치. 로그인 실패.');
                res.status(409);
                res.json(util.successFalse(null, '비밀번호 불일치. 로그인 실패.'));
            }
        }).catch(async err => {
            console.log('ID가 존재하지 않음. 로그인 실패.');
            console.dir(err);
            res.status(409);
            res.json(util.successFalse(err, 'ID가 존재하지 않음. 로그인 실패.'));
        });
};

// 후에 클라이언트에서 구현해야 할듯
// exports.logout = (req, res) => {
//     console.log('사용자 로그아웃 호출됨.');

//     if(req.decoded){
//         //로그인 된 상태
//         console.log('토큰 인증 성공');
//         jwt.destroy()
//         req.session.destroy(function(err){
//             if(err) {throw err;}

//             console.log('로그아웃되었습니다.');
//             res.status(200);
//             res.json({ success: true, message: '계정이 로그아웃 되었습니다.' });
//         });
//     }
//     else {
//         //로그인 안된 상태
//         console.log('아직 로그인되어 있지 않습니다.');
//         res.status(401); //401은 로그인을 하지 않아 페이지를 열 권한이 없는 겁니다.
//         res.json({ success: false, message: '아직 로그인하지 않았습니다.' });
//     }
// };

exports.refresh = (req, res) => {
    console.log('액세스 토큰 재발급 호출됨.');
    var refreshToken = req.headers['x-refresh-token'];
    jwt.verify(refreshToken, jwtConfig.refreshTokenSecret, function (err, decoded) {
        if (err) return res.status(401).json(util.successFalse(err)); // refresh token이 만료됐을때
        else {
            req.body = decoded;

            models.user
                .findOne({
                    where: { user_id: decoded.user_id }
                }).then(async (data) => {
                    var newAccessToken = await util.generateAccessToken(req, res);
                    res.status(201);
                    res.json(util.successTrue(newAccessToken));
                }).catch((err) => {
                    console.log('DB에서 사용자 정보 조회 실패');
                    console.dir(err);
                    res.status(500).json(util.successFalse(err, 'DB에서 사용자 정보 조회 실패'));
                });
        }
    });
}

// exports.refreshToken = (req, res) => { // 리프레시 토큰 갱신
//     var refreshToken = req.headers['x-refresh-token'];
//     jwt.verify(refreshToken, jwtConfig.refreshTokenSecret, function (err, decoded) {
//         if (err) return res.status(401).json(util.successFalse(err)); // refresh token이 만료됐을때
//         else {
//             var newAccessToken = util.generateAccessToken(req, res)
//             res.status(201);
//             res.json(util.successTrue(newAccessToken));
//         }
//     });
// }


exports.checkId = (req, res) => {
    console.log('ID 중복 검사 호출됨.');
    models.user
        .findOne({
            where: { user_id: req.body.user_id }
        })
        .then((data) => { //ID 중복 검사
            if (!(data === null || data === undefined)){
                res.status(409);
                res.json(util.successFalse(null, '이미 존재하는 ID 입니다.'));
            }
            else {
                res.status(200);
                res.json(util.successTrue());
            }
            console.log('ID 중복 검사 성공.\n');
        }).catch(err => {
            console.log('DB에서 ID 조회 실패');
            console.dir(err);
            res.status(500)
            res.json(this.successFalse(err, 'DB에서 ID 조회 실패'));
        });
}

exports.checkNickname = (req, res) => {
    console.log('닉네임 중복 검사 호출됨.');
    models.user
        .findOne({
            where: { nickname: req.body.nickname }
        })
        .then((data) => { //ID 중복 검사
            if (!(data === null || data === undefined)){
                res.status(409);
                res.json(util.successFalse(null, '이미 존재하는 닉네임입니다.'));
            }
            else {
                res.status(200);
                res.json(util.successTrue());
            }
            console.log('닉네임 중복 검사 성공.\n');
        }).catch(err => {
            console.log('DB에서 nickname 조회 실패');
            console.dir(err);
            res.status(500)
            res.json(this.successFalse(err, 'DB에서 nickname 조회 실패'));
        });
}