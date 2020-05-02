const request = require('request');
const querystring = require('querystring');
const util = require('../middleware/util');
const models = require("../models");
const NAVER_CLIENT_ID = 'kgCoE_vLTgvV6CSFYv7h';
const NAVER_CLIENT_SECRET = 'pIsycgdYAm';

exports.search = (req, res) => {// function(req, res) 익명함수와 같음
    
    let naverUrl = 'https://openapi.naver.com/v1/search/shop.json?' + querystring.stringify(req.query);

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
            let data = JSON.parse(body);
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


exports.checkSelling = (bookmarkList) => new Promise((resolve, reject) => {
    bookmarkList.forEach(bookmarkData => {
        let naverUrl = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURI(bookmarkData.dataValues.item_title);
        let options = {
            url: naverUrl,
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
            }
        }

        request.get(options, (err, response, body) => { // API에 요청
            let isSelling = false;
            if (!err && response.statusCode === 200) {
                console.log(bookmarkData.dataValues.item_title + ' 키워드 API 검색 성공');
                let apiData = JSON.parse(body).items;
                for (let i = 0; i < apiData.length; i++) { // apiData.length = items JSON 배열의 길이
                    console.log('index : ' + i);
                    console.log(apiData[i]);
                    if (apiData[i].productId === bookmarkData.dataValues.item_id) {
                        console.log('item_id와 일치하는 상품 존재');
                        isSelling = true;
                        break;
                    }
                }
                if (!isSelling) {
                    console.log('item_id와 일치하는 상품 존재하지 않음');
                    models.bookmark.update({
                        item_selling: false
                    }, {
                        where: {
                            id: bookmarkData.dataValues.id, // 교체 필요
                            user_id: bookmarkData.dataValues.user_id, // userid와 혼동하지 말것
                        }
                    })
                        .then(data => {
                            console.log('item_selling 변경 완료');
                            resolve(bookmarkList);
                        })
                        .catch(err => {
                            console.log('item_selling 변경 완료');
                            reject(err);
                        });
                    bookmarkData.dataValues.item_selling = false;
                }
            }
            else {
                console.dir(err);
                console.log(bookmarkData.dataValues.item_title + ' 키워드 API 검색 실패');
                reject(err);
            }
        })
    });
});