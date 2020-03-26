var querystring = require('querystring');
var util = require('../middleware/util');
var models = require("../models");

exports.bookmarkCreate = (req, res) => {
    console.log('북마크 생성 호출됨.');
    //1. POST로 요청할 URL) http://localhost:3000/api/bookmarks
    //2. 북마크를 만드는 유저의 토큰을 headers 탭에
    //key에 [x-access-token], value에 [토큰 값]을 입력
    //3. body에 입력해야하는 JSON 포맷
    //1)folder_name 2)bookmark_name 3)url
    models.bookmark
        .create({
            user_id: req.decoded.user_id,
            folder_name: req.body.folder_name,
            bookmark_name: req.body.bookmark_name,
            url: req.body.url
        })
        .then(data => {
            console.dir(data);
            console.log('북마크 생성됨.');
            res.status(201); // 201은 새로운 컨텐츠 만들기에 성공했을 때 사용. POST 메소드에 대한 응답으로 잘 어울림.
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            res.status(500);
            res.json(util.successFalse(err, '북마크 생성 에러.'));
        });
};


exports.bookmarkList = (req, res) => {
    //1. 북마크 폴더 내 데이터 조회 - GET으로 요청할 URL) http://localhost:3000/api/bookmarks/?foldername=
    //2. POST, PUT, PATCH 외의 GET, DELETE 메소드는 body를 보낼 필요가 없습니다.(JSON 형식으로 안보내줘도 된다는거)
    //3. 위 URL에 ?뒤 쿼리스트링을 붙혀야함. -> http://localhost:3000/api/bookmarks/?foldername=%EA%B8%B0%EB%B3%B8%20%EB%B6%81%EB%A7%88%ED%81%AC
    //4. 만드는 방법은 ?뒤에 변수이름=변수 값인데 변수 값은 인코딩 해줘야함
    //5. 인코딩 하는 방법은 http://localhost:3000/api/bookmarks/?foldername=스트리머 <-일때 스트리머 부분을 드래그해서 오른쪽 마우스 > EncodeURIcomponent 클릭
    //6. 토큰 필요합니다.
    console.log('북마크 조회 호출됨.');

    var queryFoldername = querystring.unescape(req.query.foldername);
    //url에는 한글을 지원하지 않기때문에 인코딩된 url을 쿼리스트링 모듈로 해석해서 사용

    console.log("디코드 된 foldername = " + queryFoldername);

    if (!(queryFoldername === 'null' || queryFoldername === 'undefined')) {
        models.bookmark
            .findAll({ //북마크 폴더 전체 조회
                where: {
                    user_id: req.decoded.user_id,
                    folder_name: queryFoldername
                }
            })
            .then(function (data) {
                console.dir(data);
                console.log('북마크 폴더 ' + queryFoldername + ' 조회 완료.');
                res.status(200);
                res.json(util.successTrue(data));
            })
            .catch(err => {
                console.dir(err);
                res.status(500);
                res.json(util.successFalse(err, '북마크 폴더 ' + queryFoldername + ' 조회 에러'));
            });
    }
    //1. 사용자의 모든 북마크 리스트 조회 - GET으로 요청할 URL) http://localhost:3000/api/bookmarks/
    //2. 토큰 필요합니다.
    else {
        models.bookmark
        .findAll({ //사용자의 모든 북마크 리스트 조회
            where: {
                user_id: req.decoded.user_id
            }
        })
        .then(function (data) {
            console.dir(data);
            console.log('사용자 ' + req.decoded.user_id +  '의 모든 북마크 리스트 조회 완료.');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            res.status(500);
            res.json(util.successFalse(err, req.decoded.user_id +  '의 모든 북마크 리스트 조회 에러.'));
        });
    }

};


exports.bookmarkDetail = (req, res) => {
    console.log('북마크 정보 조회 호출됨.');
    models.bookmark
        .findOne({
            where: {
                id: req.params.bookmarkid,
            }
        })
        .then(function (data) {
            if(data === null){
                console.log('북마크가 존재하지 않습니다.');
                res.status(404);
                res.json(util.successFalse(null));
            }
            else {
                console.dir(data);
                console.log('북마크 조회 완료.');
                res.status(200);
                res.json(util.successTrue(data));
            }
        })
        .catch(err => {
            console.dir(err);
            res.status(500);
            res.json(util.successFalse(err, '북마크 조회 에러'));
        });
}


exports.bookmarkFolderModify = (req, res) => {
    console.log('북마크 폴더 수정 호출됨.');
    models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .update({
            folder_name: req.body.after_name
        },{
            where: {
                user_id: req.decoded.user_id, // userid와 혼동하지 말것
                folder_name: req.body.before_name
            } 
        })
        .then(data => {
            console.dir(data);
            console.log('북마크 폴더 수정됨.');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            res.status(500);
            res.json(util.successFalse(err, '북마크 폴더 수정 에러.'));
        });
}

exports.bookmarkModify = (req, res) => {
    console.log('개별 북마크 수정 호출됨.');
    models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .update({
            user_id: req.decoded.user_id,
            folder_name: req.body.folder_name,
            bookmark_name: req.body.bookmark_name,
            url: req.body.url
        },{
            where: {id: req.params.bookmarkid} // userid와 혼동하지 말것}
        })
        .then(data => {
            console.dir(data);
            console.log('북마크 수정됨.');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            res.status(500);
            res.json(util.successFalse(err, '개별 북마크 수정 에러.'));
        });
}

exports.bookmarkFolderDelete = (req, res) => {
    console.log('북마크 폴더 삭제 호출됨.');

    var queryFoldername = querystring.unescape(req.query.foldername);
    //url에는 한글을 지원하지 않기때문에 인코딩된 url을 쿼리스트링 모듈로 해석해서 사용
    models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .destroy({
            where: {
                user_id: req.decoded.user_id,
                folder_name: queryFoldername
            }
        })
        .then(data => {
            console.dir(data);
            console.log('북마크 폴더 [' + queryFoldername + '] 삭제됨.');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            res.status(500);
            res.json(util.successFalse(err, '북마크 폴더 삭제 에러.'));
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
            res.json(util.successFalse(err, '개별 북마크 삭제 에러.'));
        });
};