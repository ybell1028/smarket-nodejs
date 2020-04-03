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

util.successFalse = function (err, message) {
    if (!err && !message) message = 'data not found';
    return {
        success: false,
        timestamp: new Date(Date.now()),
        message: message,
        errors: (err) ? util.parseError(err) : null,
        data: null
    };
};

util.parseError = function (err) {
    var parsed = {};
    if (err.name == 'ValidationError') {
        for (var name in err.errors) {
            console.log(name); 
            var validationError = err.errors[name]; ;//name = user_id
            parsed[name] = { message: validationError.message };
        }
    } else if (errors.name == 'TypeError'){

    }
     else {
        parsed.unhandled = err;
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
            validationError.errors.user_id = { message:'user_id is required!'};//name = user_id
        }
        if(!req.body.password){
            isValid = false;
            validationError.errors.password = {message:'password is required!'};
        }
        
        if(!isValid) res.status(400).json(util.successFalse(validationError));

        resolve(isValid);
    });
}


util.registerValidation = function (req, res) {
    return new Promise(function(resolve, reject){
        var isValid = true;
        var validationError = {
            name:'ValidationError',
            errors:{}
        };

        if(!req.body.user_id){
            isValid = false;
            validationError.errors.userid = { message:'user_id is required!'};
        }
        if(!req.body.password){
            isValid = false;
            validationError.errors.password = {message:'password is required!'};
        }
        if(!req.body.name){
            isValid = false;
            validationError.errors.name = {message:'name is required!'};
        }
        if(!req.body.nickname){
            isValid = false;
            validationError.errors.nickname = {message:'nickname is required!'};
        }
        if(!req.body.phonenum){
            isValid = false;
            validationError.errors.password = {message:'phonenum is required!'};
        }
        
        if(!isValid) res.status(400).json(util.successFalse(validationError));

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
                req.decoded = decoded; // req.decoded에 decode된 토큰을 저장
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