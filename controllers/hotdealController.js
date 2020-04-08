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

var date = moment().format("YYYY-MM-DD HH:mm:ss");
console.log("검색 요청 시간 : ", date);

(async function myFunction() {
  try {
    let driver = await new Builder()
      .withCapabilities(caps)
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options().headless())
      .build();
    // Apply timeout for 10 seconds
    await driver.manage().setTimeouts({ implicit: 1000 });

    let class_lists = [
      "id", // 루리웹 글 번호
      "divsn", // 루리웹 카테고리
      "subject", // 루리웹 글 제목
      "writer text_over", // 루리웹 글 작성자
      "recomd", // 추천 수
      "hit", // 조회 수
      "time", // 작성 시간
      "deco", // url 링크가 들어있는 클래스
    ];

    resultArray = [];
    for (let k = 1; k <= 2; k++) {
      await driver.manage().setTimeouts({ implicit: 1000 });
      await driver.get(
        "https://bbs.ruliweb.com/psp/board/1020&page=" + String(k)
      );
      let webElement = await driver.findElement(
        By.className("board_list_table")
      );
      let elements = await webElement.findElements(By.className("table_body"));
      // let links = await webElement.findElements(By.className("relative"));

      // for (let u = 1; u < 5; u++) {
      //   if (u == 1 || u == 2 || u == 3) {
      //     continue;
      //     console.log(u);
      //   }
      //   console.log("출력");
      //   console.log(u);
      // }
      // console.log(links.length);
      // console.log(elements.length);
      let e;

      let i = 1;
      // for (e of links) {
      //   href = await e.findElement(By.className("deco")).getAttribute("href");
      //   console.log(href);
      // }

      // 루리웹 게시판 위의 글 5개는 공지사항이라서 continue문으로 배열 원소 5개는 제외
      for (e of elements) {
        if (
          e == elements[0] ||
          e == elements[1] ||
          e == elements[2] ||
          e == elements[3] ||
          e == elements[4]
        ) {
          continue;
        }

        result = {};
        // await driver.manage().setTimeouts({ implicit: 10000 });

        //   prod_name = await e.findElement(By.className(class_lists[1])).getText();
        //   if (!(await e.findElement(By.className(class_lists[2])).getText())) {
        //     prod_intro = await e
        //       .findElement(By.className(class_lists[2]))
        //       .getText();
        //   } else {
        //     prod_intro = await e
        //       .findElement(By.className(class_lists[2]))
        //       .getText();
        //   }

        id = await e.findElement(By.className(class_lists[0])).getText();
        category = await e.findElement(By.className(class_lists[1])).getText();
        subject = await e.findElement(By.className(class_lists[2])).getText();
        writer = await e.findElement(By.className(class_lists[3])).getText();
        recomd = await e.findElement(By.className(class_lists[4])).getText();
        hit = await e.findElement(By.className(class_lists[5])).getText();
        time = await e.findElement(By.className(class_lists[6])).getText();
        url = await e
          .findElement(By.className(class_lists[7]))
          .getAttribute("href");

        result.id = id;
        result.category = category;
        result.subject = subject;
        result.writer = writer;
        result.recomd = recomd;
        result.hit = hit;
        result.time = time;
        result.url = url;

        resultArray.push(result);
        // console.log(resultArray);

        //   console.log(resultArray);
        //   console.log(i++);
      }
    }

    var sJoon = JSON.stringify(resultArray);
    console.log(sJoon);
    fs.writeFileSync("search_result.json", sJoon);
    const dataBuffer1 = fs.readFileSync("search_result.json");
    const dataJSON1 = dataBuffer1.toString();
    console.dir(dataJSON1);

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
  } finally {
    //   catch (error) {
    //     console.log("error가 발생");
    //   }
    console.log("끝");
  }
})();
