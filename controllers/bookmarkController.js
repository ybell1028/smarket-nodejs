var querystring = require('querystring');
var util = require('../middleware/util');
var models = require("../models");

exports.bookmarkCreate = (req, res) => {
    console.log('북마크 생성 호출됨.');
    //1. 요청할 URL) http://localhost:3000/api/bookmarks
    //2. 북마크를 만드는 유저의 토큰을 headers 탭에
    //key에 [x-access-token], value에 [토큰 값]을 입력
    //3. body에 입력해야하는 JSON 포맷
    //1)listname 2)bookmarkname 3)url
    models.bookmark
        .create({
            user_id: req.decoded.user_id,
            list_name: req.body.listname,
            bookmark_name: req.body.bookmarkname,
            url: req.body.url
        })
        .then(data => {
            console.log('북마크 생성됨.');
            console.dir(data);
            res.status(201); // 201은 새로운 컨텐츠 만들기에 성공했을 때 사용. POST 메소드에 대한 응답으로 잘 어울림.
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            res.status(500);
            res.json(util.successTrue(err, '북마크 생성 에러.'));
        });
};


exports.bookmarkList = (req, res) => {
    //1. 요청할 URL) http://localhost:3000/api/bookmarks/?listname=
    //2. POST외의 GET, PUT, DELETE 메소드는 body를 보낼 필요가 없습니다.(JSON 형식으로 안보내줘도 된다는거)
    //3. 위 URL에 ?뒤 쿼리스트링을 붙혀야함. -> ex)http://localhost:3000/bookmark/ybell1028?listname=%EA%B8%B0%EB%B3%B8%20%EB%B6%81%EB%A7%88%ED%81%AC
    //4. 만드는 방법은 ?뒤에 변수이름=변수 값인데 변수 값은 인코딩 해줘야함
    //5. 인코딩 하는 방법은 http://localhost:3000/bookmark/ybell1028?listname=스트리머 <-일때 스트리머 부분을 드래그해서 오른쪽 마우스 > EncodeURIcomponent 클릭
    console.log('북마크 조회 호출됨.');

    var queryListname = querystring.unescape(req.query.listname);
    //url에는 한글을 지원하지 않기때문에 인코딩된 url을 쿼리스트링 모듈로 해석해서 사용

    console.log("디코드 된 listname = " + queryListname);

    //로그인 된 상태
    models.bookmark
        .findAll({ //북마크 리스트 전체 조회
            where: {
                user_id: req.decoded.user_id,
                list_name: queryListname
            }
        })
        .then(function (data) {
            console.dir(data);
            console.log('북마크 리스트 조회 완료.');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            res.status(500);
            res.json(util.successTrue(err, '북마크 조회 에러'));
        });
};


exports.bookmarkFolderDelete = (req, res) => {
    console.log('북마크 폴더 삭제 호출됨.');

    var queryListname = querystring.unescape(req.query.listname);
    //url에는 한글을 지원하지 않기때문에 인코딩된 url을 쿼리스트링 모듈로 해석해서 사용
    models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .destroy({
            where: {
                user_id: req.session.user.id,
                list_name: queryListname
            }
        })
        .then(data => {
            console.dir(data);
            console.log('북마크 폴더 [' + queryListname + '] 삭제됨.');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            res.status(500);
            res.json(util.successTrue(err, '북마크 폴더 삭제 에러.'));
        });
};

exports.bookmarkDelete = (req, res) => {
    console.log('개별 북마크 삭제 호출됨.');
    //id는 primary key -> unique하므로 중복되는 일이 없음.이 값만으로 어떤 북마크인지 식별 가능

    models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .destroy({
            where: {
                id: req.params.bookmarkid // userid와 혼동하지 말것
            }
        })
        .then(data => {
            console.dir(data);
            console.log('북마크 삭제됨.');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            res.status(500);
            res.json(util.successTrue(err, '개별 북마크 삭제 에러.'));
        });
};