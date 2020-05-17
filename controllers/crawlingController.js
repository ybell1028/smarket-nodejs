const util = require('../middleware/util');
const querystring = require('querystring'); // 다나와는 query에 utf-8을 지원해서 인코딩이 필요없는듯
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
let date = moment().format("YYYY-MM-DD HH:mm:ss");
let request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require('iconv-lite');
const youtubeController = require('./youtubeController.js');


exports.ppoumpuHotdeal = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('뽐뿌 크롤링 호출됨.\n');
  let page = querystring.stringify(req.query);
  ppoumpuHotdeal(page, function (err, data) {
    if (err) {
      console.log('뽐뿌 크롤링 호출됨.\n');
      console.dir(err);
      res.status(409);
      res.json(util.successFalse(err, '뽐뿌 크롤링 에러.'));

    } else {
      res.status(200);
      res.json(util.successTrue(data));
      console.log('뽐뿌 크롤링 성공.\n');
    }
  })
};

exports.ruliwebHotdeal = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('루리웹 크롤링 호출됨.\n');
  let page = req.params.pageNum;
  ruliwebCrawl(page, function (err, data) {
    if (err) {
      console.log('루리웹 크롤링 에러.\n');
      console.dir(err);
      res.status(409);
      res.json(util.successFalse(err, '루리웹 크롤링 에러.'));

    } else {
      res.status(200);
      res.json(util.successTrue(data));
      console.log('루리웹 크롤링 성공.\n');
    }
  })
};


exports.fmHotdeal = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('에펨코리아 크롤링 호출됨.\n');
  let page = req.params.pageNum;
  fmHotdeal(page, function (err, data) {
    if (err) {
      console.log('에펨코리아 크롤링 성공.\n');
      console.dir(err);
      res.status(409);
      res.json(util.successFalse(err, '에펨코리아 크롤링 에러.'));

    } else {
      res.status(200);
      res.json(util.successTrue(data));
      console.log('에펨코리아 크롤링 성공.\n');
    }
  })
};

exports.clien = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('클리앙 알뜰구매 크롤링 호출됨.');
  let page = req.params.pageNum;
  clien(page, function (err, data) {
    if (err) {
      console.log('클리앙 알뜰구매 크롤링 성공.');
      console.dir(err);
      res.status(409);
      res.json(util.successFalse(err, '클리앙 알뜰구매 크롤링 에러.'));

    } else {
      res.status(200);
      res.json(util.successTrue(data));
      console.log('클리앙 알뜰구매 크롤링 성공.\n');
    }
  })
};
exports.mallTail = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('몰테일 크롤링 호출됨.');
  let page = req.params.pageNum;
  mallTail(page, function (err, data) {
    if (err) {
      console.log('몰테일 크롤링 성공.');
      console.dir(err);
      res.status(409);
      res.json(util.successFalse(err, '몰테일 크롤링 에러.'));

    } else {
      res.status(200);
      res.json(util.successTrue(data));
      console.log('몰테일 크롤링 성공.\n');
    }
  })
};

const mallTail = async (pageNum, callback) => {
  try {
    link = "https://post.malltail.com/hotdeals/index/keyword:/page:" + pageNum
    const response = await axios({
      method: "GET",
      url: link,
      headers:
      {

        "accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ko- KR, ko; q = 0.9, en - US; q = 0.8, en; q = 0.7',
        "Connection": 'keep-alive',
        "Cookie": 'CHK_REFERER=http%3A%2F%2Fpost.malltail.com%2Fhotdeals%2Findex%2Fkeyword%3A%2Fpage%3A3; __utmz=77259412.1589469283.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); ____MSLOG__initkey=0.5961439518775975; __utma=77259412.1064403396.1589469283.1589469283.1589536951.2; __utmc=77259412; ____MSLOG__initday=20200515; CAKEPHP=795a7b9226761913feb77fb88e1204b8; __utmb=77259412.66.10.1589536951; wcs_bt=s_57708fe1a199:1589538335',
        'Host': 'post.malltail.com',
        'referer': link,
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',

      }

    });

    if (response.status == 200) {
      const html = response.data;
      let ulList = [];
      const $ = cheerio.load(html);
      const $bodyList = $("#container > div.hotdeal-wrap.event_area > table > tbody > tr").not('.notice')
      p = 0
      $bodyList.each(function (i, elem) {
        j = i % 7
        if (j !== 0 && j !== 1) {
          ulList[p] = {

            category: $(this).find('td:nth-child(1)').text().trim(),
            title: $(this).find('td.title > a').text(),
            Url: "https://post.malltail.com" + $(this).find('td.title > a').attr('href'),
            replyCount: $(this).find(' td.title').text().split('(')[1].replace(/[^0-9]/g, ''),
            hit: $(this).find('td:nth-child(5)').text().trim(),
            time: $(this).find('td:nth-child(7)').text().trim(),

          };
          if (ulList[p].time.match('-')) {
            ulList[p].time = ulList[p].time.replace(/-/g, '/').slice(2, 10)
          }
          else if (ulList[p].time.match(':')) {
            ulList[p].time = ulList[p].time.slice(0, 5)
          }
          p = p + 1
        }
      });

      const data = ulList;
      console.log(data);
      callback(null, data)

    }
  } catch (error) {
    console.error(error);
  }
};


exports.coolEnjoy = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('쿨엔조이 지름 크롤링 호출됨.');
  let page = req.params.pageNum;
  coolEnjoy(page, function (err, data) {
    if (err) {
      console.log('쿨엔조이 지름 크롤링 성공.');
      console.dir(err);
      res.status(409);
      res.json(util.successFalse(err, '쿨엔조이 지름 크롤링 에러.'));

    } else {
      res.status(200);
      res.json(util.successTrue(data));
      console.log('쿨엔조이 지름 크롤링 성공.\n');
    }
  })
};
const coolEnjoy = async (pageNum, callback) => {
  try {
    link = "http://www.coolenjoy.net/bbs/jirum/p" + pageNum
    const response = await axios({
      method: "GET",
      url: link,
      headers:
      {
        "accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'ko- KR, ko; q = 0.9, en - US; q = 0.8, en; q = 0.7',
        'Cache-Control': 'max-age=0',
        "Connection": 'keep-alive',
        "Cookie": '__utmz=192136120.1589469549.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); e1192aefb64683cc97abb83c71057733=amlydW0%3D; 2a0d2363701f23f8a75028924a3af643=MTc1LjEyNC4xODguMTI0; ck_font_resize_rmv_class=; ck_font_resize_add_class=; __utma=192136120.416924668.1589469549.1589564280.1589713933.3; __utmc=192136120; __utmt=1; __utmb=192136120.5.10.1589713933',
        'Host': 'www.coolenjoy.net',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'http://www.coolenjoy.net/bbs/jirum',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
      }

    });

    if (response.status == 200) {
      const html = response.data;
      let ulList = [];
      const $ = cheerio.load(html);
      const $bodyList = $("#fboardlist > div > table > tbody > tr").not('.bo_notice')

      $bodyList.each(function (i, elem) {
        ulList[i] = {

          category: $(this).find('td.td_num').text().trim(),
          title: $(this).find('td.td_subject > a').text().split('댓')[0].trim(),
          Url: $(this).find('td.td_subject > a').attr('href'),
          replyCount: $(this).find('td.td_subject > a > span.cnt_cmt').text().trim().replace(/[^0-9]/g, ''),
          hit: $(this).find('td:nth-child(5)').text().trim(),
          time: $(this).find('td.td_date').text().trim(),

        };
        if (ulList[i].hit.match('k')) {
          ulList[i].hit = ulList[i].hit.replace(/k/g, '000').replace(/\./g, '')
        }
        if (ulList[i].time.match('-')) {
          ulList[i].time = ulList[i].time.replace(/-/g, '/')
        }
      });

      const data = ulList;
      console.log(data);
      callback(null, data)

    }
  } catch (error) {
    console.error(error);
  }
};

const clien = async (pageNum, callback) => {
  try {
    link = "https://www.clien.net/service/board/jirum?&od=T31&po=" + (pageNum - 1)
    const response = await axios({
      method: "GET",
      url: link,
      headers:
      {
        "accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ko- KR, ko; q = 0.9, en - US; q = 0.8, en; q = 0.7',
        'Cache-Control': 'max-age=0',
        "Connection": 'keep-alive',
        'Host': 'www.clien.net',
        'Cookie': 'SESSION=2c79c83d-137e-4eee-b8be-ceb8bc82d25e; SCOUTER=x5evhpumo7oqih; _ga=GA1.2.860498838.1587006483; _gid=GA1.2.1622512015.1589695048; _gat_gtag_UA_682411_1=1',
        'referer': 'https://www.clien.net/service/board/jirum',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
      },

    });

    if (response.status == 200) {
      const html = response.data;
      let ulList = [];
      const $ = cheerio.load(html);
      const $bodyList = $("#div_content > div.list_content > div > div").not('div.list_item blocked')

      $bodyList.each(function (i, elem) {
        ulList[i] = {

          category: $(this).find('div.list_title > div > a').text().trim(),
          title: $(this).find('div.list_title > span > a').text().trim().replace(/\t/g, '').split('\n')[0],
          Url: ("https://www.clien.net" + $(this).find('div.list_title > span > a').attr('href')).split('\?')[0],
          replyCount: $(this).find('div.list_title > span > a.list_reply.reply_symph > span').text().trim(),
          hit: $(this).find('div.list_hit > span').text().trim(),
          time: $(this).find('div.list_time > span').text().trim().slice(0, 5),

        };
        // if (ulList[i].hit.match('k')) {
        //   ulList[i].hit = ulList[i].hit.replace(/ k/g, '000').replace(/\./g, '')
        // }
        if (ulList[i].time.match('-')) {
          ulList[i].time = $(this).find('div.list_time > span').text().trim().slice(7, 9) + '/' + ulList[i].time.replace(/-/g, '/')
        }
      });

      const data = ulList;
      console.log(data);
      callback(null, data)

    }
  } catch (error) {
    console.error(error);
  }
};

const fmHotdeal = async (pageNum, callback) => {
  try {
    link = "https://www.fmkorea.com/index.php?mid=hotdeal&listStyle=list&page=" + pageNum
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
        'referer': 'https://www.fmkorea.com/index.php?mid=hotdeal&listStyle',
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
      const $bodyList = $("#bd_1196365581_0 > div > table > tbody > tr").not('tr.notice')

      $bodyList.each(function (i, elem) {
        ulList[i] = {

          category: $(this).find('td.cate > span > a').text().trim(),
          // title: $(this).find('td.title> a.hx').text().trim().split(') ')[0] + ')',
          title: $(this).find('td.title> a.hx').text().trim(),
          Url: link + $(this).find('td.title.hotdeal_var8 > a').attr('href'),
          replyCount: $(this).find('td.title.hotdeal_var8 > a.replyNum').text().trim(),
          hit: $(this).find('td:nth-child(5)').text().trim(),
          time: $(this).find('td.time').text().trim(),

        };
        if (ulList[i].time.length === 10) {
          ulList[i].time = ulList[i].time.replace(/\./g, '/').slice(2, 10)
        }
      });

      const data = ulList;
      callback(null, data)

    }
  } catch (err) {
    console.log(err);
  }
};


const ruliwebCrawl = (pageNum, callback) => {
  url = "https://bbs.ruliweb.com/market/board/1020?page=" + String(pageNum);
  request(url, (err, response, body) => {
    if (err) callback(err, null);
    let ulList = [];
    const $ = cheerio.load(body);
    const $bodyList = $("[class$='table_body']")

    $bodyList.each(function (i, elem) {
      ulList[i] = {
        // id: $(this).find('td.id').text().trim(),
        category: $(this).find('td.divsn a').text().trim(),
        title: $(this).find('td a.deco').text().trim(),
        Url: $(this).find('td a.deco').attr('href'),
        replyCount: $(this).find('td.subject > div > a.num_reply > span').text(),
        hit: $(this).find('td.hit span').text(),
        time: $(this).find('td.time').text().trim()
      };
      if (ulList[i].time.length === 10) {
        ulList[i].time = ulList[i].time.replace(/\./g, '/').slice(2, 10)
      }
    });
    const data = ulList;
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
          // id: $(this).find('td:nth-child(1)').text().trim(),
          category: $(this).find('nobr.han4.list_vspace').text().trim(),
          title: $(this).find('font').text().trim(),
          Url: link + `&no=${$(this).find('td:nth-child(1)').text().trim()}`,
          replyCount: $(this).find('span.list_comment2 span').text(),
          hit: $(this).find('td:nth-child(7)').text(),
          time: $(this).find('td:nth-child(5) > nobr').text().trim()
        };
        if (ulList[2 * i].time.match(':')) {
          ulList[2 * i].time = ulList[2 * i].time.slice(0, 5)
        }
      });

      $bodyList0.each(function (i, elem) {
        ulList[2 * i + 1] = {
          // id: $(this).find('td:nth-child(1)').text().trim(),
          category: $(this).find('nobr.han4.list_vspace').text().trim(),
          title: $(this).find('font').text().trim(),
          Url: link + `&no=${$(this).find('td:nth-child(1)').text().trim()}`,
          replyCount: $(this).find('span.list_comment2 span').text(),
          hit: $(this).find('td:nth-child(7)').text(),
          time: $(this).find('td:nth-child(5) > nobr').text().trim()
        };
        if (ulList[2 * i + 1].time.match(':')) {
          ulList[2 * i + 1].time = ulList[2 * i + 1].time.slice(0, 5)
        }
      });
      // console.log(ulList)
      // sJoon = []
      // sJoon[j] = JSON.stringify(ulList)
      // console.log(sJoon)
      const data = ulList;
      callback(null, data);

    }
  } catch (err) {
    console.err(err);
  }
};

// ppoumpuHotdeal(10, ppomppuBoard[0])

exports.itemSpec = (keyword) => new Promise(async (resolve, reject) => {
  try {
    search = await danawaSearch(keyword)
    inFo = await prodData(search.hidden)
    formdata = querystring.stringify(
      {
        pcode: search.hidden,
        cate1: search.cate[0],
        cate2: search.cate[1],
        cate3: search.cate[2],
        cate4: search.cate[3],
        makerName: inFo.makerName, // 미완성
        brandName: inFo.brandName, // 미완성
        makerUrl: inFo.makerUrl, // 미완성
        kccode: inFo.kccode,  // 미완성
        kpscode: inFo.kpscode,  // 미완성
        circulName: inFo.circulName,
        circulUrl: inFo.circulUrl,
        productName: inFo.productName,
        prodType: inFo.prodType,
        displayMakeDate: inFo.displayMakeDate,
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
          'Referer': `http://prod.danawa.com/info/?pcode=${formdata.pcode}`,
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

const danawaSearch = (keyword) => new Promise(async (resolve, reject) => {
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
      resolve(data);
    }

  } catch (err) {
    console.log(err);
    reject(err)
  }
});

const prodData = async (pcode, callback) => {
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


    console.log(response.status)
    const html = response.data;
    const $ = cheerio.load(html);
    const scripts = $('script').filter(function () {
      return ($(this).html().indexOf('var oProductDescriptionInfo =') > -1);
    });
    if (scripts.length === 1) {
      const text = $(scripts[0]).html();
      const oProductDescriptionInfo = text.split('var oProductDescriptionInfo = ')[1].split('};')[0] + '}'
      const productInfo = JSON.parse(oProductDescriptionInfo)
      console.dir(productInfo)
      return productInfo
    }

  } catch (error) {
    console.error(error);
  }
};

exports.itemDetail = (req, res) => {
  console.log('상품 상세 정보 조회 호출됨.');

  youtubeController.searchToTitle(req)
    .then(async detailData => {
      res.status(200);
      res.json(util.successTrue(detailData));
      console.log('북마크 상품' + req.query.query + ' 상세 정보 조회 완료.\n');
    })
    .catch(err => {
      console.dir(err);
      console.log('북마크 상품' + req.query.query + ' 상세 정보 조회 실패.\n')
      res.status(500);
      res.json(util.successFalse(err, '북마크 상품' + req.query.query + ' 상세 정보 조회 실패.'));
    });
}

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}