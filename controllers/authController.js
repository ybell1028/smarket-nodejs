var models = require("../models");
var util = require('../middleware/util');
var crypto = require('crypto');

//1. 요청할 URL) http://localhost:3000/api/auth/login
//2. 북마크를 만드는 유저의 토큰을 headers 탭에
//key에 [x-access-token], value에 [토큰 값]을 입력

exports.login = async (req, res, next) => {
    console.log('사용자 로그인 호출됨.');
    const loginValidation = await util.loginValidation(req, res);
    if (!loginValidation){
        console.log('로그인 실패');
    }
    else {
        models.user
            .findOne({
                where: { user_id: req.body.user_id }
            }).then(async function (data) { // 레코드의 실제 값은 dataValues라는 프로퍼티 안에 있음
                let dbPassword = data.dataValues.password;
                let inputPassword = req.body.password;
                let salt = data.dataValues.salt;
                let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

                if (dbPassword === hashPassword) {
                    console.log('비밀번호가 일치함.');
                    console.log(data.dataValues.user_id + ' 로그인 성공.');
                    var token = await util.generateToken(data);
                    console.log('토큰 생성됨.');
                    res.cookie('token', token, {
                        expires: new Date(Date.now() + token.expiresIn),
                        secure: true,
                        httpOnly: true 
                    });
                    res.status(200);
                    res.json(util.successTrue(token));
                }
                else {
                    console.log('비밀번호 불일치. 로그인 실패.');
                    res.status(409);
                    res.json(util.successFalse(null, '패스워드 불일치. 로그인 실패.'));
                }
            }).catch(err => { // 수정 필요
                console.log('ID가 존재하지 않음. 로그인 실패.');
                res.status(409);
                res.json(util.successFalse(err, 'ID가 존재하지 않음. 로그인 실패.'));
            });
    }
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
    models.user
        .findOne({
            where: { user_id: req.decoded.user_id }
        }).then(async function (data) {
            var token = await util.generateToken(data);
            console.log('토큰 재발급 완료.');
            res.status(200);
            res.json(util.successTrue(token));
        }).catch(function (err){
            console.log('ID가 존재하지 않음. 토큰 재발급 실패.');
            res.status(401).json(util.successFalse(err, 'ID가 존재하지 않음. 토큰 재발급 실패.'));
        });
}