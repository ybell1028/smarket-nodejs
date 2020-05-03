/* puppeteer */
const models = require("../models");
const util = require('../middleware/util');
const puppeteer = require('puppeteer');
let querystring = require('querystring'); // 다나와는 query에 utf-8을 지원해서 인코딩이 필요없는듯
let page = null;

/* cheerio */
let moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
let date = moment().format("YYYY-MM-DD HH:mm:ss");
let request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");

/* itemDetail */
const naverController = require('./naverController.js');
const youtubeController = require('./youtubeController.js');

exports.spec = (req, res) => {
  console.log('다나와 스펙 크롤링 호출됨.');
  let keyword = req.query.query;
  crawlSpec(keyword, page)
    .then(data => {
      res.status(200);
      res.json(util.successTrue(data));
    }).catch(err => {
      console.log('스펙 크롤링 에러.');
      console.dir(err);
      res.status(409);
      res.json(util.successFalse(err, '스펙 크롤링 에러.'));
    })
    
};


exports.ruliwebHotdeal = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('루리웹 크롤링 호출됨.');
  let page = req.params.pageNum;
  ruriwebCrawl(page, function (err, data) {
    if (err) {
      console.log('루리웹 크롤링 에러.');
      console.dir(err);
      res.status(409);
      res.json(util.successFalse(err, '루리웹 크롤링 에러.'));

    } else {
      res.status(200);
      res.json(util.successTrue(data));
    }
  })
};

const pageOption = {
  waitUntil: 'networkidle2'
};

const browserOption = {
  headless: true,
  args: [
    '--proxy-server="direct://"',
    '--proxy-bypass-list=*'
  ]
};

(async () => {
  try {
    const browser = await puppeteer.launch(browserOption);

    page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', req => {
      switch (req.resourceType()) {
        case 'stylesheet':
        case 'font':
        case 'media':
          req.abort();
          break;
        default:
          req.continue();
          break;
      }
    });

    await page.setViewport({
      width: 1536,
      height: 864
    });

  } catch (err) {
    err.name = 'browserError'
  } finally { // 한번에 많은 요청이 오면?
  }
})();

let crawlSpec = async function (keyword, page) {
  const start = Date.now();
  let data = {};
  let url = 'http://search.danawa.com/dsearch.php?k1=' + keyword + '&module=goods&act=dispMain';
  
  try {
    await page.goto(url, pageOption);
    // const productCodeList = await productCode(page);
    console.log('Took', Date.now() - start, 'ms');
    await delay(500);
    return await specList(page);
  } catch (err) {
    throw err;
  } finally {
  }
};

function delay( timeout ) {
	return new Promise(( resolve ) => {
		setTimeout( resolve, timeout );
	});
}

let specList = async function(page) {

  const dataSelector = '#productListArea > div.main_prodlist.main_prodlist_list > ul > li:nth-child(1) > div > div.prod_info > dl > dd > div';

  const crawledSpecList = await page.$eval(dataSelector, data => data.textContent.trim());
  
  console.log(crawledSpecList);
  
  return Promise.resolve(crawledSpecList);
};


var ruriwebCrawl = (pageNum, callback) => {
  url = "https://bbs.ruliweb.com/market/board/1020?page=" + String(pageNum);
  request(url, (err, response, body) => {
    if (err) callback(err, null);
    let ulList = [];
    const $ = cheerio.load(body);
    const $bodyList = $("[class$='table_body']")

    $bodyList.each(function (i, elem) {
      ulList[i] = {
        id: $(this).find('td.id').text().trim(),
        category: $(this).find('td.divsn a').text().trim(),
        title: $(this).find('td a.deco').text().trim(),
        Url: $(this).find('td a.deco').attr('href'),
        replyCount: $(this).find('span.num_reply span').text(),
        hit: $(this).find('td.hit span').text(),
        time: $(this).find('td.time').text().trim()
      };
    });
    const data = ulList;
    console.log(data);
    callback(null, data);
  })
};


exports.itemDetail = (req, res) => {
  let promises = [];

  promises.push(crawlSpec(req.query.query, page));
  promises.push(youtubeController.searchToTitle(req));

  Promise.all(promises)
      .then(detailData => {
          console.log('북마크 상품' + req.query.query + ' 상세 정보 조회 완료.');
          res.status(200);
          res.json(util.successTrue(detailData));
      })
      .catch(err => {
          console.dir(err);
          console.log('북마크 상품' + req.query.query + ' 상세 정보 조회 실패.')
          res.status(500);
          res.json(util.successFalse(err, '북마크 상품' + req.query.query + ' 상세 정보 조회 실패.'));
      });
}

// let productCode = async function(page){
//   const productCode = await page.evaluate(() => {
//     return document.getElementById('relationProductCodeList').value;
//   });
//   console.log(productCode[0]);
//   return Promise.resolve(productCode);
// }