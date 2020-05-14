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
const iconv = require('iconv-lite');

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

exports.ppoumpuHotdeal = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('뽐뿌 크롤링 호출됨.');
  let page = querystring.stringify(req.query);
  ppoumpuHotdeal(page, function (err, data) {
    if (err) {
      console.log('뽐뿌 크롤링 에러.');
      console.dir(err);
      res.status(409);
      res.json(util.successFalse(err, '뽐뿌 크롤링 에러.'));

    } else {
      res.status(200);
      res.json(util.successTrue(data));
    }
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

exports.fmHotdeal = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('fm핫딜 크롤링 호출됨.');
  let page = req.params.pageNum;
  fmHotdeal(page, function (err, data) {
    if (err) {
      console.log('fm핫딜 크롤링 에러.');
      console.dir(err);
      res.status(409);
      res.json(util.successFalse(err, 'fm핫딜 크롤링 에러.'));

    } else {
      res.status(200);
      res.json(util.successTrue(data));
    }
  })
};

const fmHotdeal = async (pageNum, callback) => {
  try {
    link = "https://www.fmkorea.com/index.php?mid=hotdeal&sort_index=pop&order_type=desc&listStyle=webzine&page=" + pageNum
    const response = await axios({
      method: "GET",
      url: link,
      headers:
      {
        // ":authority": 'loader.fmkorea.com',
        "method": 'GET',
        "path": '/_myphp/adpost/content_new.php?url=https%3A%2F%2Fwww.fmkorea.com%2Findex.php%3Fmid%3Dhotdeal%26sort_index%3Dpop%26order_type%3Ddesc%26listStyle%3Dwebzine&ref=&m=0&c=1589354285354',
        "scheme": 'https',
        "accept": 'application / json, text/ javascript */*; q=0.01',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ko- KR, ko; q = 0.9, en - US; q = 0.8, en; q = 0.7',
        'origin': 'https://www.fmkorea.com',
        'referer': 'https://www.fmkorea.com/index.php?mid=hotdeal&sort_index=pop&order_type=desc&listStyle=webzine',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla / 5.0(Windows NT 10.0; Win64; x64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 81.0.4044.138 Safari / 537.36',
      }

    });

    if (response.status == 200) {
      const html = response.data;
      let ulList = [];
      const $ = cheerio.load(html);
      const $bodyList = $("[class$='li ']")

      $bodyList.each(function (i, elem) {
        ulList[i] = {
          // id: $(this).find('div.li span.label').text(),
          rank: $(this).find('div.li span.count').text(),
          // img: $(this).find('div.li img.thumb').attr('src'),
          category: $(this).find('span.category').text().replace(/\//gi, "").trim(),
          title: $(this).find('h3.title a,hotdeal_var8').text().trim(),
          info: $(this).find('div.hotdeal_info span a').text().trim(),
          Url: link + $(this).find('h3.title a,hotdeal_var8').attr('href'),
          // replyCount: $(this).find('div hotdeal_info span a').text(),
          // hit: $(this).find('td.eng.list_vspace').text(),
          time: $(this).find('span.regdate').text().trim(),

        };
      });

      const data = ulList;
      console.log(data);
      callback(null, data)

    }
  } catch (error) {
    console.error(error);
  }
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
    data.spec = await specList(page);
    return data;
  } catch (err) {
    throw err;
  } finally {
  }
};

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

let specList = async function (page) {

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


const ppoumpuHotdeal = async (page, callback) => {
  try {
    link = "http://www.ppomppu.co.kr/zboard/zboard.php?" + page
    const response = await axios({
      method: "GET",
      url: link,
      headers:
      {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Cookie': '_ga=GA1.3.1122820503.1583393905; PHPSESSID=t19aicnjbjsk61l40st1b231j2; nxc=nxc_1589412177; mc_bn=14; mb_bn=12; t_bn=4; rrr_bn_h=1; m_gad_pos_passback_1=1; m_gad_pos_passback_4=1; m_gad_pos_passback_6=1; m_gad_pos_passback_8=1; m_gad_pos_passback_9=1; m_gad_pos_passback_10=1; m_gad_pos_passback_12=1; m_gad_pos_passback_15=1; m_gad_pos_passback_16=1; m_gad_pos_passback_17=1; m_gad_pos_passback_18=1; m_gad_pos_passback_20=1; m_gad_pos_passback_21=1; m_gad_pos_passback_22=1; m_gad_pos_passback_50=1; m_gad_pos_passback_55=1; m_gad_pos_passback_58=1; _gid=GA1.3.1237514050.1589412180; _gat=1; bl_bn=9; ts_bn=16; bbs_bn=22; rrr_banner=19; m_gad_pos_1=17; m_gad_pos_4=8; m_gad_pos_6=10; m_gad_pos_8=21; m_gad_pos_9=12; m_gad_pos_10=18; m_gad_pos_12=21; m_gad_pos_15=15; m_gad_pos_16=19; m_gad_pos_17=17; m_gad_pos_18=15; m_gad_pos_20=13; m_gad_pos_21=11; m_gad_pos_22=16; m_gad_pos_50=15; m_gad_pos_55=7; m_gad_pos_58=18; wcs_bt=179d32fb63a6c:1589412197',
        'Host': 'www.ppomppu.co.kr',
        'referer': link,
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'

      },
      responseType: "arraybuffer",
      responseEncoding: "binary"
    });
    if (response.status == 200) {
      const html = iconv.decode(response.data, "euc-kr").toString();
      let ulList = [];
      const $ = cheerio.load(html);
      const $bodyList = $("[class$='list1']")
      const $bodyList0 = $("[class$='list0']")

      $bodyList.each(function (i, elem) {
        ulList[2 * i] = {
          id: $(this).find('td:nth-child(1)').text().trim(),
          category: $(this).find('nobr.han4.list_vspace').text().trim(),
          title: $(this).find('font.list_title').text().trim(),
          Url:link+ `&no=${$(this).find('td:nth-child(1)').text().trim()}`,
          replyCount: $(this).find('span.list_comment2 span').text(),
          hit: $(this).find('td:nth-child(7)').text(),
          time: $(this).find('td:nth-child(5) > nobr').text().trim()
        };
      });

      $bodyList0.each(function (i, elem) {
        ulList[2 * i + 1] = {
          id: $(this).find('td:nth-child(1)').text().trim(),
          category: $(this).find('nobr.han4.list_vspace').text().trim(),
          title: $(this).find('font.list_title').text().trim(),
          Url:link+ `&no=${$(this).find('td:nth-child(1)').text().trim()}`,
          replyCount: $(this).find('span.list_comment2 span').text(),
          hit: $(this).find('td:nth-child(7)').text(),
          time: $(this).find('nobr.eng.list_vspace').text().trim()
        };
      });
      // console.log(ulList)
      // sJoon = []
      // sJoon[j] = JSON.stringify(ulList)
      // console.log(sJoon)
      const data = ulList;
      console.log(data);
      callback(null, data);

    }
  } catch (error) {
    console.error(error);
  }
};

// ppoumpuHotdeal(10, ppomppuBoard[0])

const itemSpec = async (keyword, callback) => {
  try {
    search = danawaSearch(keyword)
    formdata = querystring.stringify(
      {
        pcode: search.hidden,
        cate1: search[[4][0]],
        cate2: search[[4][1]],
        cate3: search[[4][2]],
        cate4: search[[4][3]],
        makerName: '', // 미완성
        brandName: '', // 미완성
        makerUrl: '', // 미완성
        kccode: '',  // 미완성
        kpscode: '',  // 미완성
        circulName: '',
        circulUrl: '',
        productName: '',
        prodType: '',
        displayMakeDate: search.date,
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
          // 'Accept': 'text/html, */*; q=0.01',
          // 'AcceptEncoding': 'gzip, deflate',
          // 'AcceptLanguage': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          // 'Connection': 'keep-alive',
          // 'ContentLength': '533',
          // 'ContentType': 'application/x-www-form-urlencoded; charset=UTF-8',
          // 'Cookie': 'danawa-loggingApplicationClient=0e2b04cf-e9aa-4460-881a-3136dbba27f5; _ga=GA1.2.208717042.1583803510; ADWEBCOUNTER_UUID=abd22176-5744-20e2-9b38-1daa02caab9a; ADWEBCOUNTER_KEYWORD=; OAX=r3y8fF6W9WwAAGIN; ADWEBCOUNTER_URL=google.com; _INSIGHT_CK_8204=2d19ec171f979094b13c13185ef31a6b_47312|11792e1c8fbe00a6335e13185ef31a6b_47313:1588149114000; DPG_MOBILE_ARTICLE_MOVE_GUIDE=false; cookSaveShopInfo=EE128%3A2020-05-08; recentProductYN=Y; cookSaveProdInfo=12%3A10931007%3A495000%7C11%3A5937666%3A33300%7C11%3A4678115%3A42000%7C11%3A7342828%3A169500%7C18%3A8733146%3A77430%7C12%3A10234701%3A866100%7C12%3A8946266%3A754940%7C11%3A6160126%3A92720%7C12%3A9492972%3A435000%7C17%3A10515417%3A25000%7C19%3A7419571%3A8900%7C11%3A8100778%3A32900%7C12%3A6470540%3A145000%7C16%3A10590585%3A40920%7C12%3A6468060%3A30000; _gid=GA1.2.1214192827.1589157765; cookieGuestId=e41434714c4597a6bd319affc921b38a; cookNewSearchKeyword=%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.11%7CDDR4-2666%3E05.04%7C%EB%B3%B5%ED%95%A9%EA%B8%B0%3E04.26%7C%EC%95%84%EC%9D%B4%ED%8C%A8%EB%93%9C2%20%EC%A4%91%EA%B3%A0%EA%B0%80%EA%B2%A9%3E04.24%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS5e%2010.5%20LTE%20128G%3E04.20%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS5e%2010.5%2064G%3E04.20%7C%ED%8C%85%EB%A7%A4%EC%B9%984%ED%98%B8%20%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EA%B2%BD%EB%9F%89%EC%B6%95%EA%B5%AC%EA%B3%B5%2011%EC%84%B8%EC%9D%B4%ED%95%98%20%EC%95%84%EB%8F%99%EC%9A%A9%EC%B6%95%EA%B5%AC%EA%B3%B5%3E04.20%7C%EC%8A%A4%ED%83%80%EC%8A%A4%ED%8F%AC%EC%B8%A0%20%EB%AA%AC%ED%83%80%EB%82%98%205%ED%98%B8%20%EC%B6%95%EA%B5%AC%EA%B3%B5%20SB895%3E04.20%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EC%82%BC%EC%84%B1%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS6%2010.5%20WiFi%20128G%3E04.20%7C%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%3E04.20; cPreviousKeyword=%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8; _INSIGHT_CK_8203=dbd08b20fb13b1d7f25fbd4e26cddbe1_03510|2646020e3363a1be76dcf97ad38a5d15_75222:1589177022000; wcs_bt=s_3b3fb74948b1:1589175222',
          // 'Host': 'prod.danawa.com',
          // 'Origin': 'http://prod.danawa.com',
          'Referer': 'http://prod.danawa.com/info/?pcode=11156937',
          // 'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
          // 'XRequestedWith': 'XMLHttpRequest',
        },
        // enconding: 'utf-8'
      }
    );

    console.log(response.status)
    const html = response.data;
    let ulList = [];
    const $ = cheerio.load(html);
    const $bodyList = $('[class$="spec_tbl"]')

    if (response.status == 200) {
      $bodyList.each(function (i, elem) {
        ulList[i] = {
          spec: $(this).find('tbody tr').text().replace(/(\n)/g, "/").replace(/(\t)/g, ""),
        };
      });

      const data = ulList;
      console.log(data);
      callback(null, data);
    }

  } catch (error) {
    console.error(error);
  }
};

const danawaSearch = async (keyword) => {
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
          'Referer': 'http://search.danawa.com/dsearch.php?&module=goods&act=dispMain',
          'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
          'XRequestedWith': 'XMLHttpRequest',
        },
        // enconding: 'utf-8'
      }
    );

    console.log(response.status)
    const html = response.data;
    let ulList = [];
    const $ = cheerio.load(html);
    const $bodyList = $("[class$='prod_item ']")
    if (response.status == 200) {
      $bodyList.each(function (i, elem) {
        ulList[i] = {
          title: $(this).find('p.prod_name').text().trim().replace(/(\r\n\t|\n|\r\t)/g, ""),
          intro: $(this).find('p.intro_text').text(),
          spec: $(this).find('div.spec_list').text().replace(/(\t)/gm, ""),
          hidden: $(this).find('input').attr('id').slice(25),
          // hidden1: $(this).parent().find('li').attr('id').slice(11),
          cate: $(this).find('div.prod_pricelist ul').parent().attr('data-cate').split('|'),
          date: $(this).find('dl.meta_item.mt_date dd').text()
        };
      });

      const data = ulList[0];
      console.log(data);
      return data
    }

  } catch (error) {
    console.error(error);
  }
};



exports.itemDetailtest = (req, res) => {

  let promises = []
  promises.push(itemSpec(req.query.query))
  promises.push(youtubeController.searchToTitle(req));

  Promise.all(promises)
    .then(detailData => {
      console.log('북마크 상품' + req.query.query + ' 상세 정보 조회 완료.');
      res.status(200);
      console.log(detailData[0]); // spec
      console.log(detailData[1][0]); // youtube data
      res.json(util.successTrue(detailData));
    })
    .catch(err => {
      console.dir(err);
      console.log('북마크 상품' + req.query.query + ' 상세 정보 조회 실패.')
      res.status(500);
      res.json(util.successFalse(err, '북마크 상품' + req.query.query + ' 상세 정보 조회 실패.'));
    });

}



exports.itemDetail = (req, res) => {
  let promises = [];

  promises.push(crawlSpec(req.query.query, page));
  promises.push(youtubeController.searchToTitle(req));

  Promise.all(promises)
    .then(detailData => {
      console.log('북마크 상품' + req.query.query + ' 상세 정보 조회 완료.');
      res.status(200);
      console.log(detailData); // spec
      console.log(detailData[1][0]); // youtube data
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