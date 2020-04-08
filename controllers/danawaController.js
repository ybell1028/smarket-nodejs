const { Builder, By, until, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
let axios = require("axios");
let cheerio = require("cheerio");
let fs = require("fs");
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
const caps = new Capabilities();
caps.setPageLoadStrategy("normal");
let j = require("./howtojson");
var express = require("express"); // express 모듈 제어 가능
var app = express();

var date = moment().format("YYYY-MM-DD HH:mm:ss");
console.log("검색 요청 시간 : ", date);

(async function myFunction() {
  app.listen(3001, function () {
    console.log("서버 연결중...");
  });
  try {
    // j.readJSON("keywords.json");
    // const makeJSON2 = (x) => {
    //   return
    // }
    // const makejson3 = (x) => x;
    // var mkaejson4 = (x) => (x);
    // function not1(x){
    //   return !x;
    // }
    // const not2 = x => !x;
    const dataBuffer = fs.readFileSync("keywords.json");
    const dataJSON = dataBuffer.toString();
    console.log(dataJSON);
    // json 파일 데이터 파싱
    const data = JSON.parse(dataJSON);
    console.log(data.keywords);

    let driver = await new Builder()
      .withCapabilities(caps)
      .forBrowser("chrome")
      //   .setChromeOptions(new chrome.Options().headless())
      .build();
    // Apply timeout for 10 seconds
    await driver.manage().setTimeouts({ implicit: 1000 });
    await driver.get(
      "http://search.danawa.com/dsearch.php?query=" +
        data.keywords +
        "&originalQuery=" +
        data.keywords +
        "&previousKeyword=" +
        data.keywords +
        "&volumeType=vmvs&page=1&limit=30&sort=saveDESC&list=list&boost=true&addDelivery=N&tab=main&tab=main"
    );
    // Waiting 30 seconds for an element to be present on the page, checking
    // for its presence once every 5 seconds.
    let class_lists = [
      "prod_info",
      "prod_name",
      "prod_intro",
      "prod_spec_set",
      "relation_goods_unit",
      "prod_sub_info",
      "prod_pricelist",
    ];

    let webElement = await driver.findElement(By.className("product_list"));
    let elements = await webElement.findElements(By.className("prod_item"));
    let e;
    resultArray = [];

    let i = 1;
    for (e of elements) {
      result = {};

      prod_name = await e.findElement(By.className(class_lists[1])).getText();
      prod_intro = "";
      console.log(prod_intro);
      try {
        prod_intro = await e
          .findElement(By.className(class_lists[2]))
          .getText();
      } catch {
        if (prod_intro == null) {
          prod_intro = "";
        }
      }
      try {
        prod_spec_set = "";
        prod_spec_set = await e
          .findElement(By.className(class_lists[3]))
          .getText();
      } catch {
        if (prod_spec_set == null) {
          prod_spec_set = "";
        }
      }
      relation_goods_unit = await e
        .findElement(By.className(class_lists[4]))
        .getText();
      prod_sub_info = await e
        .findElement(By.className(class_lists[5]))
        .getText();
      prod_pricelist = await e
        .findElement(By.className(class_lists[6]))
        .getText();

      result.prod_name = prod_name;
      result.prod_intro = prod_intro;
      result.prod_spec_set = prod_spec_set;
      result.relation_goods_unit = relation_goods_unit;
      result.prod_sub_info = prod_sub_info;
      result.prod_pricelist = prod_pricelist;

      resultArray.push(result);

      console.log(resultArray);
      console.log(i++);
      //   if (i > elements.length) {
      //     break;
      //   }
    }

    var sJoon = JSON.stringify(resultArray);
    console.log(sJoon);
    fs.writeFileSync("search_result.json", sJoon);
    const dataBuffer1 = fs.readFileSync("search_result.json");
    const dataJSON1 = dataBuffer1.toString();
    console.log(dataJSON1);
    app.get("/", function (req, res) {
      res.sendFile(__dirname + "/search_result.json");
    });

    // var isEmpty = function (value) {
    //   if (
    //     value == "" ||
    //     value == null ||
    //     value == undefined ||
    //     (value != null &&
    //       typeof value == "object" &&
    //       !Object.keys(value).length)
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // };
  } catch (error) {
    console.log("error가 발생");
  }
})();
