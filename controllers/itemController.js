const { google } = require('googleapis');
const request = require('request');
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require('iconv-lite');
const querystring = require('querystring');
const util = require('../middleware/util');
const YOUTUBE_API_KEY = 'AIzaSyC7YY58-0d5LffCoYBHUlYZCqFKOJawxwQ';
// const YOUTUBE_API_KEY = 'AIzaSyCe41JVtYAPPC8a5yOQZJkwuKFLJMGHT7A';

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
let date = moment().format("YYYY-MM-DD HH:mm:ss");

exports.itemDetail = async (req, res) => {
    let promises = [];
    console.log('상품 상세 정보 조회 호출됨.');
    search = await danawaSearch(req.query.query);
    if (search != undefined) {
        info = await prodData(search.hidden)
        promises.push(await itemSpec(search, info));
        promises.push(await itemReview(search, info, req.query.reviewcount));
        promises.push(await itemNews(search, info));
        // promises.push(await itemYoutube(req.query.query));
        Promise.all(promises)
            .then(result => {
                console.log('상품 상세 정보 조회 성공.\n');
                res.status(200);
                res.json(util.successTrueDetail(result[0], result[1], result[2], null));
            })
            .catch(err => {
                console.log('상품 상세 정보 조회 실패.\n');
                res.status(403);
                res.json(util.successFalse(err, '상품 상세 정보 조회 실패.'));
            })


    }
    else {
        console.log('상품 상세 정보 조회 실패.\n');
        res.status(200);
        res.json(util.successTrueDetail(null, null, null, null))
    }
}


const itemSpec = (search, info) => new Promise(async (resolve, reject) => {
    //Promise OK.
    try {
        formdata = querystring.stringify(
            {
                pcode: search.hidden,
                cate1: info.cate.nCategoryCode1,
                cate2: info.cate.nCategoryCode2,
                cate3: info.cate.nCategoryCode3,
                cate4: info.cate.nCategoryCode4,
                makerName: info.productInfo.makerName, // 미완성
                // brandName: inFo.prouctInfo.brandName, // 미완성
                makerUrl: info.productInfo.makerUrl, // 미완성
                kccode: info.productInfo.kccode,  // 미완성
                kpscode: info.productInfo.kpscode,  // 미완성
                circulName: info.productInfo.circulName,
                circulUrl: info.productInfo.circulUrl,
                productName: info.productInfo.productName,
                prodType: info.productInfo.prodType,
                displayMakeDate: info.productInfo.displayMakeDate,
                productFullName: search.title
            }
        )
        link = "http://prod.danawa.com/info/ajax/getProductDescription.ajax.php"
        const response = await axios(
            {
                method: "POST",
                url: link,
                data: formdata,
                headers: {
                    'Accept': 'text/html, */*; q=0.01',
                    'AcceptEncoding': 'gzip, deflate',
                    'AcceptLanguage': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    // 'ContentLength': '533',
                    'ContentType': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Cookie': 'danawa-loggingApplicationClient=0e2b04cf-e9aa-4460-881a-3136dbba27f5; _ga=GA1.2.208717042.1583803510; ADWEBCOUNTER_UUID=abd22176-5744-20e2-9b38-1daa02caab9a; ADWEBCOUNTER_KEYWORD=; OAX=r3y8fF6W9WwAAGIN; ADWEBCOUNTER_URL=google.com; _INSIGHT_CK_8204=2d19ec171f979094b13c13185ef31a6b_47312|11792e1c8fbe00a6335e13185ef31a6b_47313:1588149114000; DPG_MOBILE_ARTICLE_MOVE_GUIDE=false; cookSaveShopInfo=EE128%3A2020-05-08; recentProductYN=Y; cookSaveProdInfo=12%3A10931007%3A495000%7C11%3A5937666%3A33300%7C11%3A4678115%3A42000%7C11%3A7342828%3A169500%7C18%3A8733146%3A77430%7C12%3A10234701%3A866100%7C12%3A8946266%3A754940%7C11%3A6160126%3A92720%7C12%3A9492972%3A435000%7C17%3A10515417%3A25000%7C19%3A7419571%3A8900%7C11%3A8100778%3A32900%7C12%3A6470540%3A145000%7C16%3A10590585%3A40920%7C12%3A6468060%3A30000; _gid=GA1.2.1214192827.1589157765; cookieGuestId=e41434714c4597a6bd319affc921b38a; cookNewSearchKeyword=%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.11%7CDDR4-2666%3E05.04%7C%EB%B3%B5%ED%95%A9%EA%B8%B0%3E04.26%7C%EC%95%84%EC%9D%B4%ED%8C%A8%EB%93%9C2%20%EC%A4%91%EA%B3%A0%EA%B0%80%EA%B2%A9%3E04.24%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS5e%2010.5%20LTE%20128G%3E04.20%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS5e%2010.5%2064G%3E04.20%7C%ED%8C%85%EB%A7%A4%EC%B9%984%ED%98%B8%20%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EA%B2%BD%EB%9F%89%EC%B6%95%EA%B5%AC%EA%B3%B5%2011%EC%84%B8%EC%9D%B4%ED%95%98%20%EC%95%84%EB%8F%99%EC%9A%A9%EC%B6%95%EA%B5%AC%EA%B3%B5%3E04.20%7C%EC%8A%A4%ED%83%80%EC%8A%A4%ED%8F%AC%EC%B8%A0%20%EB%AA%AC%ED%83%80%EB%82%98%205%ED%98%B8%20%EC%B6%95%EA%B5%AC%EA%B3%B5%20SB895%3E04.20%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EC%82%BC%EC%84%B1%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS6%2010.5%20WiFi%20128G%3E04.20%7C%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%3E04.20; cPreviousKeyword=%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8; _INSIGHT_CK_8203=dbd08b20fb13b1d7f25fbd4e26cddbe1_03510|2646020e3363a1be76dcf97ad38a5d15_75222:1589177022000; wcs_bt=s_3b3fb74948b1:1589175222',
                    'Host': 'prod.danawa.com',
                    'Origin': 'http://prod.danawa.com',
                    'Referer': `http://prod.danawa.com/info/?pcode=${formdata.pcode}`,
                    'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
                    'XRequestedWith': 'XMLHttpRequest',
                },
                // enconding: 'utf-8'
            }
        );

        const html = response.data;
        let ulList = [];
        const $ = cheerio.load(html);
        const $bodyList = $('[class$="spec_tbl"]').find('tbody tr')
        speclist = []
        speclist1 = new Object()
        speclist2 = new Array()
        keyname = ''

        if (response.status == 200) {
            $bodyList.each(function (i, elem) {
                if ($(this).children().length == 4 || $(this).children().length == 2) {
                    // speclist.push($(this).find('th:nth-child(1)').text().replace(/\n/g, '') + ': ' + $(this).find('td:nth-child(2)').text().trim().replace(/\t/g, '').replace(/\n/g, ''))
                    // speclist.push($(this).find('th:nth-child(3)').text() + ':' + $(this).find('td:nth-child(4)').text())
                    // console.log(speclist)
                    // b = $(this).find('th:nth-child(1)').text()

                    // speclist1[$(this).find('th:nth-child(3)').text()] = $(this).find('td:nth-child(4)').text().trim().replace(/\t/g, '')
                    if ($(this).children().length != 2) {
                        if ($(this).find('td:nth-child(2)').text().trim().replace(/\t/g, '') != '') {
                            speclist1[$(this).find('th:nth-child(1)').text()] = $(this).find('td:nth-child(2)').text().trim().replace(/\t/g, '').replace(/\n/g, '')
                        }
                        if ($(this).find('td:nth-child(4)').text().trim().replace(/\t/g, '') != '') {
                            speclist1[$(this).find('th:nth-child(3)').text()] = $(this).find('td:nth-child(4)').text().trim().replace(/\t/g, '')
                        }
                    }
                }


            });
            await speclist2.push(speclist1)
            resolve(speclist2);
        }

    } catch (err) {
        console.log(err);
        reject(err);
    }
});


const itemReview = (search, info, reviewcount) => new Promise(async (resolve, reject) => {
    try {
        link = `http://prod.danawa.com/info/dpg/ajax/companyProductReview.ajax.php?t=0.38440935379219865&prodCode=${search.hidden}&cate1Code=${info.productInfo.nCategoryCode1}&page=1&limit=${reviewcount}&score=0&sortType=&usefullScore=Y&innerKeyword=&subjectWord=0&subjectWordString=&subjectSimilarWordString=`

        referer = `http://prod.danawa.com/info/?pcode=${search.hidden}`

        const response = await axios(
            {

                method: "GET",
                url: link,
                headers: {
                    'Accept': ' */*',
                    'AcceptEncoding': 'gzip, deflate',
                    'AcceptLanguage': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    'ContentType': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Cookie': 'ADWEBCOUNTER_UUID=03bd7cbf-77c5-209c-918c-f6fd954a64b0; danawa-loggingApplicationClient=0e2b04cf-e9aa-4460-881a-3136dbba27f5; _ga=GA1.2.208717042.1583803510; ADWEBCOUNTER_KEYWORD=; OAX=r3y8fF6W9WwAAGIN; _INSIGHT_CK_8204=2d19ec171f979094b13c13185ef31a6b_47312|11792e1c8fbe00a6335e13185ef31a6b_47313:1588149114000; recentProductYN=Y; _gid=GA1.2.1105565467.1589469673; cookSaveShopInfo=EE128%3A2020-05-08%7CTP402%3A2020-05-15%7CTH201%3A2020-05-17; cookNewSearchKeyword=%EC%95%84%EC%9D%B4%ED%8C%A8%EB%93%9C%207%EC%84%B8%EB%8C%80%3E05.17%7C%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.17%7Cqcy%20t5%3E05.17%7C%ED%83%9C%EC%96%91%EC%B4%88%EA%B3%A0%EC%B6%94%EC%9E%A5%3E05.17%7C%3E05.17%7C%ED%83%9C%EC%96%91%EC%B4%88%20%EA%B3%A0%EC%B6%94%EC%9E%A5%3E05.17%7C%ED%83%9C%EC%96%91%EC%B4%88%20%EA%B3%A0%EC%B6%AA%E3%85%87%3E05.17%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS6%20%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.16%7Cqcy%20t5%20pro%3E05.16%7C%EB%8B%8C%ED%85%90%EB%8F%84%20%EC%8A%A4%EC%9C%84%EC%B9%98%3E05.16; PHPSESSID=08bsef6o0eepc3m2695ilbiov2; ADWEBCOUNTER_URL=; cookSaveProdInfo=12%3A10929630%3A439000%7C12%3A9492972%3A398000%7C10%3A11206107%3A26650%7C19%3A8706542%3A555930%7C11%3A5937666%3A32920%7C10%3A10893660%3A19420%7C10%3A10906536%3A15070%7C10%3A9959532%3A26580%7C10%3A9921900%3A18980%7C11%3A8080807%3A31500%7C18%3A4666038%3A12370%7C15%3A10409847%3A247000%7C12%3A10931013%3A475000%7C11%3A3274953%3A11810%7C15%3A4423224%3A345000; _INSIGHT_CK_8203=dbd08b20fb13b1d7f25fbd4e26cddbe1_03510|8cab0d22e52ee20ca1569d5f9e053538_81181:1589782997000; wcs_bt=s_3b3fb74948b1:1589781197; _gat=1',
                    'Host': 'prod.danawa.com',
                    'Referer': referer,
                    'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
                },
                // enconding: 'utf-8'
            }
        );

        const html = response.data;
        let ulList = [];
        const $ = cheerio.load(html);
        const $bodyList = $("[class ='danawa-prodBlog-companyReview-clazz-more']")
        if (response.status == 200) {
            $bodyList.each(function (i, elem) {
                ulList[i] = {
                    title: ($(this).find('div.tit_W > p').text().trim(), $(this).find('div.tit_W > p').text().trim()),
                    content: $(this).find('div.atc').text(),
                    user: $(this).find('span.name').text(),
                    score: $(this).find('span.point_type_s > span').text(),
                    mall: $(this).find('span.mall').text(),
                    date: $(this).find('span.date').text()
                };

            });
            resolve(ulList);
        }

    } catch (err) {
        console.dir(err);
        reject(err);
    }
});


const itemNews = (search) => new Promise(async (resolve, reject) => {
    try {
        pagenum = 1
        link = `http://prod.danawa.com/info/dpg/ajax/newsRoom.ajax.php?&prodCode=${search.hidden}&page=1&limit=6`
        referer = 'http://prod.danawa.com/info/?pcode=' + search.hidden
        const response = await axios(
            {
                method: "GET",
                url: link,
                headers: {
                    'Accept': '*/*',
                    'AcceptEncoding': 'gzip, deflate',
                    'AcceptLanguage': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    'ContentLength': '316',
                    'ContentType': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Cookie': 'ADWEBCOUNTER_UUID=03bd7cbf-77c5-209c-918c-f6fd954a64b0; danawa-loggingApplicationClient=0e2b04cf-e9aa-4460-881a-3136dbba27f5; _ga=GA1.2.208717042.1583803510; ADWEBCOUNTER_KEYWORD=; OAX=r3y8fF6W9WwAAGIN; _INSIGHT_CK_8204=2d19ec171f979094b13c13185ef31a6b_47312|11792e1c8fbe00a6335e13185ef31a6b_47313:1588149114000; recentProductYN=Y; _gid=GA1.2.1105565467.1589469673; cookSaveShopInfo=EE128%3A2020-05-08%7CTP402%3A2020-05-15%7CTH201%3A2020-05-17; cookNewSearchKeyword=%EC%95%84%EC%9D%B4%ED%8C%A8%EB%93%9C%207%EC%84%B8%EB%8C%80%3E05.17%7C%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.17%7Cqcy%20t5%3E05.17%7C%ED%83%9C%EC%96%91%EC%B4%88%EA%B3%A0%EC%B6%94%EC%9E%A5%3E05.17%7C%3E05.17%7C%ED%83%9C%EC%96%91%EC%B4%88%20%EA%B3%A0%EC%B6%94%EC%9E%A5%3E05.17%7C%ED%83%9C%EC%96%91%EC%B4%88%20%EA%B3%A0%EC%B6%AA%E3%85%87%3E05.17%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS6%20%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.16%7Cqcy%20t5%20pro%3E05.16%7C%EB%8B%8C%ED%85%90%EB%8F%84%20%EC%8A%A4%EC%9C%84%EC%B9%98%3E05.16; PHPSESSID=08bsef6o0eepc3m2695ilbiov2; ADWEBCOUNTER_URL=; cookSaveProdInfo=12%3A10929630%3A439000%7C12%3A9492972%3A398000%7C10%3A11206107%3A26650%7C19%3A8706542%3A555930%7C11%3A5937666%3A32920%7C10%3A10893660%3A19420%7C10%3A10906536%3A15070%7C10%3A9959532%3A26580%7C10%3A9921900%3A18980%7C11%3A8080807%3A31500%7C18%3A4666038%3A12370%7C15%3A10409847%3A247000%7C12%3A10931013%3A475000%7C11%3A3274953%3A11810%7C15%3A4423224%3A345000; _INSIGHT_CK_8203=dbd08b20fb13b1d7f25fbd4e26cddbe1_03510|43160423994aa0f421184f56bbeed0a3_66798:1589768684000; wcs_bt=s_3b3fb74948b1:1589766884',
                    'Host': 'prod.danawa.com',
                    'Referer': referer,
                    'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
                },
            }
        );

        const html = response.data;
        const $ = cheerio.load(html);
        let ulList = [];
        const $bodyList = $("[class ='thmb_con']")
        if (response.status == 200) {
            $bodyList.each(function (i, elem) {
                ulList[i] = {
                    img: $(this).find('img').attr('src'),
                    title: $(this).find('div a span').text().trim().replace(/\t|\n/g, ""),
                    url: 'http://dpg.danawa.com/news/view?boardSeq=' + $(this).find('a').attr('data-board') + '&listSeq=' + $(this).find('a').attr('id').replace(/[^0-9]/g, ''),
                    user: $(this).find('div > div > div > div').text().replace(/\t|\n/g, ''),
                    hit: $(this).find('span.view > em').text(),
                    date: $(this).find('span.date').text().slice(2, 10).replace(/\./g, '/')
                };
            });
            data = ulList
            resolve(ulList);
        }

    } catch (err) {
        console.dir(err);
        reject(err)
    }
});

const itemYoutube = (keyword) => new Promise((resolve, reject) => {

    var options = {
        q: keyword,
        part: "snippet",
        key: YOUTUBE_API_KEY,
        type: "video",
        // maxResults: req.query.maxResults,
        regionCode: "KR"
    };

    var youtubeUrl = 'https://www.googleapis.com/youtube/v3/search?' + querystring.stringify(options);

    request.get(youtubeUrl, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            console.log('유튜브 API 검색 성공\n');
            resolve(JSON.parse(body).items);
        }
        else {
            console.dir(err);
            console.log('유튜브 API 검색 실패\n');
            reject(err);
        }
    });
});


const danawaSearch = (keyword) => new Promise(async (resolve, reject) => {
    //Promise Ok.
    try {
        formdata = querystring.stringify(
            {
                query: keyword,
                originalQuery: '',
                previousKeyword: '',
                volumeType: 'vmvs',
                page: '1',
                limit: '30',
                sort: 'saveDESC',
                list: 'list',
                boost: 'true',
                addDelivery: 'N',
                tab: 'main'
            }
        )
        link = "http://search.danawa.com/ajax/getProductList.ajax.php"
        const response = await axios(
            {
                method: "POST",
                url: link,
                data: formdata,
                headers: {
                    'Accept': 'text/html, */*; q=0.01',
                    'AcceptEncoding': 'gzip, deflate',
                    'AcceptLanguage': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    'ContentLength': '316',
                    'ContentType': 'application/x-www-form-urlencoded',
                    'Cookie': 'danawa-loggingApplicationClient=0e2b04cf-e9aa-4460-881a-3136dbba27f5; _ga=GA1.2.208717042.1583803510; ADWEBCOUNTER_UUID=abd22176-5744-20e2-9b38-1daa02caab9a; ADWEBCOUNTER_KEYWORD=; OAX=r3y8fF6W9WwAAGIN; ADWEBCOUNTER_URL=google.com; _INSIGHT_CK_8204=2d19ec171f979094b13c13185ef31a6b_47312|11792e1c8fbe00a6335e13185ef31a6b_47313:1588149114000; DPG_MOBILE_ARTICLE_MOVE_GUIDE=false; cookSaveShopInfo=EE128%3A2020-05-08; recentProductYN=Y; cookSaveProdInfo=12%3A10931007%3A495000%7C11%3A5937666%3A33300%7C11%3A4678115%3A42000%7C11%3A7342828%3A169500%7C18%3A8733146%3A77430%7C12%3A10234701%3A866100%7C12%3A8946266%3A754940%7C11%3A6160126%3A92720%7C12%3A9492972%3A435000%7C17%3A10515417%3A25000%7C19%3A7419571%3A8900%7C11%3A8100778%3A32900%7C12%3A6470540%3A145000%7C16%3A10590585%3A40920%7C12%3A6468060%3A30000; _gid=GA1.2.1214192827.1589157765; cookieGuestId=e41434714c4597a6bd319affc921b38a; cookNewSearchKeyword=%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.11%7CDDR4-2666%3E05.04%7C%EB%B3%B5%ED%95%A9%EA%B8%B0%3E04.26%7C%EC%95%84%EC%9D%B4%ED%8C%A8%EB%93%9C2%20%EC%A4%91%EA%B3%A0%EA%B0%80%EA%B2%A9%3E04.24%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS5e%2010.5%20LTE%20128G%3E04.20%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS5e%2010.5%2064G%3E04.20%7C%ED%8C%85%EB%A7%A4%EC%B9%984%ED%98%B8%20%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EA%B2%BD%EB%9F%89%EC%B6%95%EA%B5%AC%EA%B3%B5%2011%EC%84%B8%EC%9D%B4%ED%95%98%20%EC%95%84%EB%8F%99%EC%9A%A9%EC%B6%95%EA%B5%AC%EA%B3%B5%3E04.20%7C%EC%8A%A4%ED%83%80%EC%8A%A4%ED%8F%AC%EC%B8%A0%20%EB%AA%AC%ED%83%80%EB%82%98%205%ED%98%B8%20%EC%B6%95%EA%B5%AC%EA%B3%B5%20SB895%3E04.20%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EC%82%BC%EC%84%B1%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS6%2010.5%20WiFi%20128G%3E04.20%7C%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%3E04.20; cPreviousKeyword=%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8; _INSIGHT_CK_8203=dbd08b20fb13b1d7f25fbd4e26cddbe1_03510|2646020e3363a1be76dcf97ad38a5d15_75222:1589177022000; wcs_bt=s_3b3fb74948b1:1589175222',
                    'Host': 'search.danawa.com',
                    'Origin': 'http://search.danawa.com',
                    'Referer': `http://search.danawa.com/dsearch.php?&module=goods&act=dispMain`,
                    'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
                    'XRequestedWith': 'XMLHttpRequest',
                },
                // enconding: 'utf-8'
            }
        );

        const html = response.data;
        let ulList = [];
        const $ = cheerio.load(html);
        const $bodyList = $("div.main_prodlist.main_prodlist_list > ul > li")
        if (response.status == 200) {
            $bodyList.each(function (i, elem) {
                ulList[i] = {
                    title: $(this).find('p.prod_name').text().trim().replace(/(\r\n\t|\n|\r\t)/g, ""),
                    intro: $(this).find('p.intro_text').text(),
                    spec: $(this).find('div.spec_list').text().replace(/(\t)/gm, ""),
                    hidden: $(this).attr('id').replace(/[^0-9]/g, ''),
                    // hidden1: $(this).parent().find('li').attr('id').slice(11),
                    // cate: $(this).find('div.prod_pricelist ul').parent().attr('data-cate').split('|'),
                    date: $(this).find('dl.meta_item.mt_date dd').text()
                };
            });

            const data = ulList[0];
            resolve(data);
        }

    } catch (err) {
        console.log(err);
        reject(err)
    }
});


const prodData = (pcode) => new Promise(async (resolve, reject) => {
    try {

        link = "http://prod.danawa.com/info/?pcode=" + pcode
        const response = await axios(
            {
                method: "GET",
                url: link,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'AcceptEncoding': 'gzip, deflate',
                    'AcceptLanguage': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'max-age=0',
                    'Connection': 'keep-alive',
                    'ContentLength': '316',
                    'ContentType': 'application/x-www-form-urlencoded',
                    'Cookie': 'ADWEBCOUNTER_UUID=03bd7cbf-77c5-209c-918c-f6fd954a64b0; danawa-loggingApplicationClient=0e2b04cf-e9aa-4460-881a-3136dbba27f5; _ga=GA1.2.208717042.1583803510; ADWEBCOUNTER_KEYWORD=; OAX=r3y8fF6W9WwAAGIN; _INSIGHT_CK_8204=2d19ec171f979094b13c13185ef31a6b_47312|11792e1c8fbe00a6335e13185ef31a6b_47313:1588149114000; recentProductYN=Y; ADWEBCOUNTER_URL=; _gid=GA1.2.1105565467.1589469673; cookSaveShopInfo=EE128%3A2020-05-08%7CTP402%3A2020-05-15; cookNewSearchKeyword=%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS6%20%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.16%7C%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.16%7Cqcy%20t5%20pro%3E05.16%7C%EB%8B%8C%ED%85%90%EB%8F%84%20%EC%8A%A4%EC%9C%84%EC%B9%98%3E05.16%7Cqcy%20t5%3E05.16%7C%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS6%20%EB%9D%BC%EC%9D%B4%ED%8A%B8%2010.4%20LTE%2064GB%3E05.15%7Cusb%20%ED%97%88%EB%B8%8C%3E05.13%7C%EC%82%BC%EC%84%B1%20ddr4%208g%20pc4-21300%3E05.13%7C%EC%82%BC%EC%84%B1%3E05.13%7C%ED%83%9C%EB%B8%94%EB%A6%BF%3E05.13; cookieGuestId=7cce453fa2e1d529b39f199a3678ea44; PHPSESSID=ffed6uadb6hbudncph9luqc0a7; _gat=1; cookSaveProdInfo=12%3A10929630%3A439000%7C10%3A11206107%3A26650%7C19%3A8706542%3A555930%7C11%3A5937666%3A32920%7C10%3A10893660%3A19420%7C10%3A10906536%3A15070%7C10%3A9959532%3A26580%7C10%3A9921900%3A18980%7C11%3A8080807%3A31500%7C18%3A4666038%3A12370%7C15%3A10409847%3A247000%7C12%3A10931013%3A475000%7C11%3A3274953%3A11810%7C15%3A4423224%3A345000%7C12%3A10931007%3A474390; wcs_bt=s_3b3fb74948b1:1589583579; _INSIGHT_CK_8203=dbd08b20fb13b1d7f25fbd4e26cddbe1_03510|f88f992353f7e0cc73389055118e14f0_83009:1589585381000',
                    'Host': 'prod.danawa.com',
                    // 'Origin': 'http://search.danawa.com',
                    // 'Referer': 'http://search.danawa.com/dsearch.php?&module=goods&act=dispMain',
                    'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
                    // 'XRequestedWith': 'XMLHttpRequest',
                },
                // enconding: 'utf-8'
            }
        );

        const html = response.data;
        const $ = cheerio.load(html);
        const scripts = $('script').filter(function () {
            return ($(this).html().indexOf('var oProductDescriptionInfo =') > -1);
        });
        if (scripts.length === 1) {
            const text = $(scripts[0]).html();
            const oProductDescriptionInfo = text.split('var oProductDescriptionInfo = ')[1].split('};')[0] + '}'
            const oGlobalSetting = text.split('var oGlobalSetting = ')[1].split('};')[0].replace(/\t|\n/g, '') + '}'

            const productInfo = JSON.parse(oProductDescriptionInfo)
            // const productInfo1 = JSON.parse(oGlobalSetting)
            // console.log(oProductDescriptionInfo)
            // console.log(productInfo)
            // // console.log(oProductDescriptionInfo)
            // console.log(oGlobalSetting)
            var cate = eval("(" + oGlobalSetting + ")");
            var prodlist = {}
            prodlist.productInfo = productInfo
            prodlist.cate = cate


            resolve(prodlist);
        }


    } catch (err) {
        console.dir(err);
        reject(err);
    }
});