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


exports.ppomppu = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('뽐뿌 크롤링 호출됨.\n');
  let page = querystring.stringify(req.query);
  ppomppu(page, function (err, data) {
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


const ppomppu = async (page, callback) => {
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

// ppomppu(10, ppomppuBoard[0])


exports.ruliweb = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('루리웹 크롤링 호출됨.\n');
  let page = req.params.pageNum;
  ruliweb(page, function (err, data) {
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


const ruliweb = (pageNum, callback) => {
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


exports.fmkorea = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('에펨코리아 크롤링 호출됨.\n');
  let page = req.params.pageNum;
  fmkorea(page, function (err, data) {
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


const fmkorea = async (pageNum, callback) => {
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
        // 'Cookie': 'SESSION=a99d34dd-dc2c-4f4f-8b64-052f21a687be; SCOUTER=x5evhpumo7oqih; _ga=GA1.2.860498838.1587006483; _gid=GA1.2.1172848127.1589862768; _gat_gtag_UA_682411_1=1',
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
      const $bodyList = $("#div_content > div.list_content > div.contents_jirum > div.list_item:not(.blocked)")

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
  } catch (err) {
    console.dir(err);
  }
};


exports.malltail = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('몰테일 크롤링 호출됨.');
  let page = req.params.pageNum;
  malltail(page, function (err, data) {
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


const malltail = async (pageNum, callback) => {
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
      callback(null, data)

    }
  } catch (err) {
    console.dir(err);
  }
};


exports.coolenjoy = (req, res) => {
  console.log("검색 요청 시간 : ", date);
  console.log('쿨엔조이 지름 크롤링 호출됨.');
  let page = req.params.pageNum;
  coolenjoy(page, function (err, data) {
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


const coolenjoy = async (pageNum, callback) => {
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
      callback(null, data)

    }
  } catch (err) {
    console.dir(err);
  }
};

// exports.priceFlow = (req, res) => {
//   console.log("검색 요청 시간 : ", date);
//   console.log('다나와 가격 추이 크롤링 호출됨.\n');
//   let period = querystring.stringify(req.query);
//   priceFlow(req.query.keyword, 3, function (err, data) {
//     if (err) {
//       console.log('다나와 가격 추이 크롤링 호출됨.\n');
//       console.dir(err);
//       res.status(409);
//       res.json(util.successFalse(err, '다나와 가격 추이 크롤링 에러.'));
//     } else {
//       res.status(200);
//       res.json(util.successTrue(data));
//       console.log('다나와 가격 추이 크롤링 성공.\n');
//     }
//   })
// };


// const priceFlow = async (keyword, period, callback) => {
//   try {
//     search = await danawaSearch(keyword)
//     link = `http://prod.danawa.com/info/ajax/getProductPriceList.ajax.php?productCode=${search.hidden}&period=${period}`
//     const response = await axios(
//       {
//         method: "GET",
//         url: link,
//         headers: {
//           'Accept': 'application/json, text/javascript, */*; q=0.01',
//           'AcceptEncoding': 'gzip, deflate',
//           'AcceptLanguage': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
//           // 'Cache-Control': 'max-age=0',
//           'Connection': 'keep-alive',
//           'ContentLength': '316',
//           'ContentType': 'application/x-www-form-urlencoded',
//           'Cookie': 'ADWEBCOUNTER_UUID=03bd7cbf-77c5-209c-918c-f6fd954a64b0; danawa-loggingApplicationClient=0e2b04cf-e9aa-4460-881a-3136dbba27f5; _ga=GA1.2.208717042.1583803510; ADWEBCOUNTER_KEYWORD=; OAX=r3y8fF6W9WwAAGIN; _INSIGHT_CK_8204=2d19ec171f979094b13c13185ef31a6b_47312|11792e1c8fbe00a6335e13185ef31a6b_47313:1588149114000; recentProductYN=Y; _gid=GA1.2.1105565467.1589469673; cookSaveShopInfo=EE128%3A2020-05-08%7CTP402%3A2020-05-15%7CTH201%3A2020-05-17; cookNewSearchKeyword=%EC%95%84%EC%9D%B4%ED%8C%A8%EB%93%9C%207%EC%84%B8%EB%8C%80%3E05.17%7C%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.17%7Cqcy%20t5%3E05.17%7C%ED%83%9C%EC%96%91%EC%B4%88%EA%B3%A0%EC%B6%94%EC%9E%A5%3E05.17%7C%3E05.17%7C%ED%83%9C%EC%96%91%EC%B4%88%20%EA%B3%A0%EC%B6%94%EC%9E%A5%3E05.17%7C%ED%83%9C%EC%96%91%EC%B4%88%20%EA%B3%A0%EC%B6%AA%E3%85%87%3E05.17%7C%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90%20%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADS6%20%EB%9D%BC%EC%9D%B4%ED%8A%B8%3E05.16%7Cqcy%20t5%20pro%3E05.16%7C%EB%8B%8C%ED%85%90%EB%8F%84%20%EC%8A%A4%EC%9C%84%EC%B9%98%3E05.16; PHPSESSID=08bsef6o0eepc3m2695ilbiov2; ADWEBCOUNTER_URL=; cookSaveProdInfo=12%3A10929630%3A439000%7C12%3A9492972%3A398000%7C10%3A11206107%3A26650%7C19%3A8706542%3A555930%7C11%3A5937666%3A32920%7C10%3A10893660%3A19420%7C10%3A10906536%3A15070%7C10%3A9959532%3A26580%7C10%3A9921900%3A18980%7C11%3A8080807%3A31500%7C18%3A4666038%3A12370%7C15%3A10409847%3A247000%7C12%3A10931013%3A475000%7C11%3A3274953%3A11810%7C15%3A4423224%3A345000; _INSIGHT_CK_8203=dbd08b20fb13b1d7f25fbd4e26cddbe1_03510|43160423994aa0f421184f56bbeed0a3_66798:1589768684000; wcs_bt=s_3b3fb74948b1:1589766884',
//           'Host': 'prod.danawa.com',
//           // 'Origin': 'http://search.danawa.com',
//           'Referer': 'http://prod.danawa.com/info/?pcode=10929630&keyword=%EA%B0%A4%EB%9F%AD%EC%8B%9C%ED%83%ADs6%EB%9D%BC%EC%9D%B4%ED%8A%B8&cate=122577',
//           'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
//           'XRequestedWith': 'XMLHttpRequest',
//         },
//         // enconding: 'utf-8'
//       }
//     );
//     console.log(response.status)
//     const html = await response.data;
//     let ulList = {
//       price: html
//     };
//     callback(null, ulList);

//   } catch (err) {
//     console.dir(err);
//     callback(err, null);
//   }
// };


function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}