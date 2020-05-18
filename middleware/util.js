var jwt = require('jsonwebtoken');
var models = require("../models");
var jwtConfig = require("../config/jwt");

var util = {};

util.successTrue = function (data) {
    return {
        success: true,
        timestamp: new Date(Date.now()),
        data: data
    };
};

util.successFalse = function (err, comment) {
    if (!err && !comment) comment = 'data not found';

    return {
        success: false,
        timestamp: new Date(Date.now()),
        data: (err) ? util.parseError(err) : null,
        comment: (comment) ? comment : null
    };
};

util.parseError = function (err) {
    var parsed = {
        name: err.name,
        msg: err.message
    };
    if (err.name == 'ValidationError') {
        return err;
    }
    else {
        return parsed;
    }
};


exports.result = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.status(422);
        console.dir(err);
        err.errors.name = err.name
        res.json(util.successFalse({ 
            name: 'ValidationError',
            errors : err.errors //에러가 ID에서만 나면 [0], password까지 나면 [1]까지 배열 출력
            })
        );
    }
    else next();
}

util.generateAccessToken = function(req, res){
    return new Promise((resolve, reject) => {
        jwt.sign({
            user_id: req.body.user_id,
            admin: req.body.admin
        }, jwtConfig.accessTokenSecret, {
            algorithm : 'HS256',
            expiresIn: jwtConfig.accessTokenLife
        }, (err, token) => {
            if (err) 
                return res.json(util.successFalse(err));
            else resolve(token);
        });
    });
}

util.generateRefreshToken = function(req, res) {
    return new Promise((resolve, reject) => {
        jwt.sign({
            user_id: req.body.user_id,
            admin: req.body.admin
        }, jwtConfig.refreshTokenSecret, {
            algorithm : 'HS256',
            expiresIn: jwtConfig.refreshTokenLife
        }, (err, token) => {
            if (err) 
                return res.json(util.successFalse(err));
            else resolve(token);
        });
    });
}

util.isLoggedin = function (req, res, next) {
    var token = req.headers['x-access-token'] || req.query.token;
    //token 변수에 토큰이 없다면
    if (!token) return res.json(util.successFalse(null, '로그인이 필요합니다.'));
    //토큰이 있다면
    else {
        jwt.verify(token, jwtConfig.accessTokenSecret, function (err, decoded) {
            if (err) return res.status(401).json(util.successFalse(err));
            else {
                console.dir(decoded);
                console.log('JWT 인증됨.')
                req.body.user_id = decoded.user_id;
                next();
            }
        });
    }
};

util.isAdmin = function (req, res, next) {
    var token = req.headers['x-access-token'] || req.query.token;
    //token 변수에 토큰이 없다면
    if (!token) return res.json(util.successFalse(null, '관리자 권한이 필요합니다'));
    //토큰이 있다면
    else {
        jwt.verify(token, jwtConfig.accessTokenSecret, function (err, decoded) {
            if (err) return res.status(401).json(util.successFalse(err));
            else {
                if(decoded.admin) {
                    console.dir(decoded);
                    req.body.user_id = decoded.user_id;
                    next();
                }
                else {
                    res.status(401).json(util.successFalse(null, '권한이 없습니다.')); // 권한 없음
                }
            }
        });
    }
};

//토큰에 들어있는 ID와 DB에서 찾은 ID와 비교
util.checkPermission = (req, res, next) => {
    models.user 
        .findOne({
            where: { user_id: req.params.userid }
        }).then((data) => {
            console.dir(req.decoded);
            if (data.dataValues.user_id === req.body.user_id)
                next();

            else res.status(401).json(util.successFalse(null, "you don't have permission"));
        }).catch((err) => {
            res.status(401).json(util.successFalse(err));
        })
};

module.exports = util;