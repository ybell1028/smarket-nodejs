var jwt = require('jsonwebtoken');
var models = require("../models");
var secretObj = require("../config/jwt");

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

util.generateToken = function(data){
    return new Promise((resolve, reject) => {
        jwt.sign({
            user_id: data.dataValues.user_id
        }, secretObj.secret, {
            algorithm : 'HS256',
            expiresIn: '1d'
        }, (err, token) => {
            if (err) 
                return res.json(util.successFalse(err));
            else resolve(token);
        });
    });
}

// 토큰 유효성 검사 미들웨어
// 미들웨어로 token이 있는지 없는지 확인하고 token이 있다면 jwt.verify 함수를 이용해서 토큰 hash를
// 확인하고 토큰에 들어있는 정보를 해독합니다. 해독한 정보는 req.decoded에 저장하고 있으며
// 이후 로그인 유무는 decoded가 있는지 없는지를 통해 알 수 있습니다.
util.isLoggedin = function (req, res, next) {
    var token = req.headers['x-access-token'] || req.query.token;
    //token 변수에 토큰이 없다면
    if (!token) return res.json(util.successFalse(null, 'token is required!'));
    //토큰이 있다면
    else {
        jwt.verify(token, secretObj.secret, function (err, decoded) {
            if (err) return res.status(401).json(util.successFalse(err));
            else {
                console.dir(decoded);
                req.decoded = decoded; // req.decoded에 decode된 토큰을 저장
                next();
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