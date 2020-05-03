var express = require("express");
const crawlingController = require("../controllers/crawlingController");
var router = express.Router();

// GET api/crawling/spec?query=검색어 - 해당 검색어의 스펙 크롤링
router.get("/spec", crawlingController.spec);

// GET api/crawling/ruliweb/페이지 번호 - 속도가 빠르기 때문에 한 페이지씩 가져와도 될것같음
router.get("/ruliweb/:pageNum", crawlingController.ruliwebHotdeal);

// GET api/crawling/detail?query=item_title - 아이템 이름으로 상세 정보 검색 
router.get("/detail", crawlingController.itemDetail);

module.exports = router;