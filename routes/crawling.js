var express = require("express");
const crawlingController = require("../controllers/crawlingController");
var router = express.Router();

// GET api/crawling/detail/price?query=item_title - 아이템 이름으로 가격 추이 검색 
// router.get("/detail/price", crawlingController.priceFlow);

// GET api/crawling/ruliweb/페이지 번호 - 속도가 빠르기 때문에 한 페이지씩 가져와도 될것같음
router.get("/ruliweb/:pageNum", crawlingController.ruliweb);

// GET api/crawling/ppomppu/?id=id이름&page=페이지번호 - 속도가 빠르기 때문에 한 페이지씩 가져와도 될 것 같음
// id이름에 따른 게시판 종류
// 뽐뿌게시판 : ppomppu , 해외뽐뿌 ppomppu4,  오프라인뽐뿌: ppomppu5 쇼핑특가: shopping 
// 사용 예시 : api/crawling/ppomppu?id=ppomppu5&page=1 오프라인 뽐뿌게시판의 1page 
router.get("/ppomppu", crawlingController.ppomppu);

// GET api/crawling/fmhotdeal/페이지 번호 - 속도가 빠르기 때문에 한 페이지씩 가져와도 될것같음
router.get("/fmkorea/:pageNum", crawlingController.fmkorea)

// GET api/crawling/clienhotdeal/페이지 번호 - 속도가 빠르기 때문에 한 페이지씩 가져와도 될것같음
router.get("/clien/:pageNum", crawlingController.clien)

// GET api/crawling/coolenjoy/페이지 번호 - 속도가 빠르기 때문에 한 페이지씩 가져와도 될것같음
router.get("/coolenjoy/:pageNum", crawlingController.coolenjoy)

// GET api/crawling/malltail/페이지 번호 - 속도가 빠르기 때문에 한 페이지씩 가져와도 될것같음
router.get("/malltail/:pageNum", crawlingController.malltail)

module.exports = router;