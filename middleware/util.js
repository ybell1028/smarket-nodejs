var jwt = require('jsonwebtoken');
var models = require("../models");
var jwtConfig = require("../config/jwt");

var util = {};

util.successTrue = function (data) {
    return {
        success: true,
        message: null,
        errors: null,
        data: data
    };
};

util.successFalse = function (err, message) {
    if (!err && !message) message = 'data not found';
    return {
        success: false,
        message: message,
        errors: (err) ? util.parseError(err) : null,
        data: null
    };
};

util.parseError = function (errors) {
    var parsed = {};
    if (errors.name == 'ValidationError') {
        for (var name in errors.errors) {
            var validationError = errors.errors[name];
            parsed[name] = { message: validationError.message };
        }
    } else if (errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
        parsed.username = { message: 'This username already exists!' };
    } else {
        parsed.unhandled = errors;
    }
    return parsed;
};

util.loginValidation = function (req, res) {
    return new Promise(function(resolve, reject){
        var isValid = true;
        var validationError = {
            name:'ValidationError',
            errors:{}
        };

        if(!req.body.user_id){
            isValid = false;
            validationError.errors.userid = { message:'UserId is required!'};
        }
        if(!req.body.password){
            isValid = false;
            validationError.errors.password = {message:'Password is required!'};
        }
        
        if(!isValid) res.json(util.successFalse(validationError));

        resolve(isValid);
    });
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


util.generateRefreshToken = function(req, res){
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


util.createPayload = function(req, res){
    return new Promise((resolve, reject) => {
        req.payload = {
            user_id: req.body.user_id,
            admin: req.body.admin
        }
        if(req.payload === null || req.payload === undefined)
            reject();
        else
            resolve()
    });
}


util.isLoggedin = function (req, res, next) {
    var token = req.headers['x-access-token'] || req.query.token;
    //token 변수에 토큰이 없다면
    if (!token) return res.json(util.successFalse(null, 'token is required!'));
    //토큰이 있다면
    else {
        jwt.verify(token, jwtConfig.accessTokenSecret, function (err, decoded) {
            if (err.name === "TokenExpiredError") { //만약 토큰이 만료 되었다면
                req.body = jwt.verify(token, jwtConfig.accessTokenSecret, {ignoreExpiration: true} );
                console.dir(req.body);
                // 페이로드를 req에 저장
                models.user
                    .findOne({
                        attributes: ['refresh_token']
                    },{
                        where: {user_id : req.body.user_id}
                    }).then((data) => {
                        jwt.verify(data, jwtConfig.refreshTokenSecret, function (err, decoded) {
                            if (err) return res.status(401).json(util.successFalse(err)); // refresh token이 만료됐을때
                            else {
                                var newAccessToken = util.generateAccessToken(req, res)
                                res.status(201);
                                res.json(util.successTrue(newAccessToken));
                            }
                        })
                    }).catch((err) => {
                        console.log('DB에서 사용자 정보 조회 실패');
                        console.dir(err);
                        res.status(500).json(util.successFalse(err, 'DB에서 사용자 정보 조회 실패'));
                    });

            } else if (err) {
                return res.status(401).json(util.successFalse(err));
            }
            else {
                console.dir(decoded);
                req.decoded = decoded; // req.decoded에 decode된 토큰을 저장
                next();
            }
        });
    }
};

util.isAdmin = function (req, res, next) {
    var token = req.headers['x-access-token'] || req.query.token;
    //token 변수에 토큰이 없다면
    if (!token) return res.json(util.successFalse(null, 'token is required!'));
    //토큰이 있다면
    else {
        jwt.verify(token, jwtConfig.accessTokenSecret, function (err, decoded) {
            if (err) return res.status(401).json(util.successFalse(err));
            else {
                if(decoded.admin) {
                    console.dir(decoded);
                    req.decoded = decoded; // req.decoded에 decode된 토큰을 저장
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
            if (data.dataValues.user_id === req.decoded.user_id)
                next();

            else res.status(401).json(util.successFalse(null, "you don't have permission"));
        }).catch((err) => {
            res.status(401).json(util.successFalse(err));
        })
};

module.exports = util;