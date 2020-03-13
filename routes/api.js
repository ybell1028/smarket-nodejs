var express = require('express');
var request = require('request');
var router = express.Router();
const NAVER_CLIENT_ID = 'kgCoE_vLTgvV6CSFYv7h';
const NAVER_CLIENT_SECRET = 'pIsycgdYAm';



router.get('/search', function(req, res){
    
    var naver_host = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURI(req.query.query);
    
    let options = {
        url: naver_host,
        headers:{
            'X-Naver-Client-Id':NAVER_CLIENT_ID,
            'X-Naver-Client-Secret':NAVER_CLIENT_SECRET
        }
    }
    request.get(options , function(err, response, body) { // res, response 중복 주의
        if(!err && response.statusCode == 200){
            console.dir(req.query);
            console.log('검색 성공')
            console.log('statusCode : ' + response.statusCode);
            res.status(response.statusCode);
            res.json(JSON.parse(body));
        }
        else {
            console.dir(req.query);
            console.log('검색 실패')
            console.log('error : ' + res.statusCode);
            res.status(response.statusCode);
            res.json({success:false, message:err});
        }
    });
});

module.exports = router;