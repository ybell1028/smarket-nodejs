var express = require("express");
const crawlingController = require("../controllers/crawlingController");
var router = express.Router();

// GET api/crawling/detail/?query=item_title - 아이템 이름으로 상세 정보 검색 
router.get("/detail", crawlingController.itemDetail);

// GET api/crawling/ruliweb/페이지 번호 - 속도가 빠르기 때문에 한 페이지씩 가져와도 될것같음
router.get("/ruliweb/:pageNum", crawlingController.ruliwebHotdeal);

// GET api/crawling/ppomppu/?id=id이름&page=페이지번호 - 속도가 빠르기 때문에 한 페이지씩 가져와도 될 것 같음
// id이름에 따른 게시판 종류
// 뽐뿌게시판 : ppomppu , 해외뽐뿌 ppomppu4,  오프라인뽐뿌: ppomppu5 쇼핑특가: shopping 
// 사용 예시 : api/crawling/ppomppu?id=ppomppu5&page=1 오프라인 뽐뿌게시판의 1page 
router.get("/ppomppu", crawlingController.ppoumpuHotdeal);

// GET api/crawling/fmhotdeal/페이지 번호 - 속도가 빠르기 때문에 한 페이지씩 가져와도 될것같음
router.get("/fmhotdeal/:pageNum", crawlingController.fmHotdeal)
module.exports = router;