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
        headers: {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
    }

    request.get(options, function (err, response, body) { // res, response 중복 주의
        if (!err && response.statusCode === 200) {
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

exports.checkItem = (item) => new Promise((resolve, reject) => {
    let naverUrl = 'https://openapi.naver.com/v1/search/shop.json?query=' + encodeURI(item.dataValues.item_title);
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
            console.log(item.dataValues.item_title + ' 키워드 API 검색 성공.');
            let apiData = JSON.parse(body).items;
            for (let j = 0; j < apiData.length; j++) { // apiData.length = items JSON 배열의 길이
                if (apiData[j].productId === item.dataValues.item_id) {
                    console.log('item_id와 일치하는 상품 존재.');
                    isSelling = true;
                    item.dataValues.item_lprice = apiData[j].lprice;
                    item.dataValues.item_link = apiData[j].link;
                    item.dataValues.item_image = apiData[j].image;
                    break;
                }
            }
            if (!isSelling) {
                console.log('item_id와 일치하는 상품 존재하지 않음.');
                item.dataValues.item_selling = false;
                models.bookmark.update({
                    item_selling: false
                }, {
                    where: {
                        id: item.dataValues.id, // 교체 필요
                        user_id: item.dataValues.user_id, // userid와 혼동하지 말것
                    }
                })
                .then(data => {
                    console.log('item_selling 변경 완료.\n');
                    resolve(item);
                })
                .catch(err => {
                   console.log('item_selling 변경 실패.\n');
                   reject(err);
                });
            }
            else {
                console.log('item 정보 업데이트 완료.\n');
                resolve(item);
            }
        }
        else {
            console.dir(err);
            console.log(item.dataValues.item_title + ' 키워드 API 검색 실패.\n');
            reject(err);
        }
    })
});