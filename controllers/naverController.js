var request = require('request');
var querystring = require('querystring');
var util = require('../middleware/util');
const NAVER_CLIENT_ID = 'kgCoE_vLTgvV6CSFYv7h';
const NAVER_CLIENT_SECRET = 'pIsycgdYAm';

exports.search = (req, res) => {// function(req, res) 익명함수와 같음
    
    var naverUrl = 'https://openapi.naver.com/v1/search/shop.json?' + querystring.stringify(req.query);

    let options = {
        url: naverUrl,
        headers:{
            'X-Naver-Client-Id':NAVER_CLIENT_ID,
            'X-Naver-Client-Secret':NAVER_CLIENT_SECRET
        }
    }
    request.get(options , function(err, response, body) { // res, response 중복 주의
        if(!err && response.statusCode === 200){
            console.log('네이버 API 검색 성공');
            let data = JSON.parse(body)
            res.status(response.statusCode);
            res.json(util.successTrue(data));
        }
        else {
            console.dir(err);
            console.log('네이버 API 검색 실패');
            res.status(response.statusCode);
            res.json(util.successFalse(err, '네이버 API 검색 실패'));
        }
    });
};