var querystring = require('querystring');
var util = require('../middleware/util');
var models = require("../models");

exports.bookmarkCreate = (req, res) => {
    console.log('북마크 생성 호출됨.');
    models.bookmark
        .create({
            user_id: req.body.user_id,
            folder_name: req.body.folder_name,
            item_id: req.body.item_id,
            item_title: req.body.item_title,
            item_type: req.body.item_type
        })
        .then(data => {
            console.dir(data);
            console.log('북마크 생성됨.');
            res.status(201); // 201은 새로운 컨텐츠 만들기에 성공했을 때 사용. POST 메소드에 대한 응답으로 잘 어울림.
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            console.log('북마크 에러.');
            res.status(500);
            res.json(util.successFalse(err, '북마크 생성 에러.'));
        });
};

exports.bookmarkList = (req, res) => {
    console.log('북마크 조회 호출됨.');

    var queryFoldername = querystring.unescape(req.query.foldername);

    console.log("디코드 된 folder_name = " + queryFoldername);

    if (!(queryFoldername === 'null' || queryFoldername === 'undefined')) {
        models.bookmark
            .findAll({
                where: {
                    user_id: req.body.user_id,
                    folder_name: queryFoldername
                }
            })
            .then(function (data) {//null값 나오면 어떻게해야해!
                console.dir(data);
                console.log('북마크 폴더 ' + queryFoldername + ' 조회 완료.');
                res.status(200);
                res.json(util.successTrue(data));
            })
            .catch(err => {
                console.dir(err);
                console.log('북마크 폴더 조회 에러')
                res.status(500);
                res.json(util.successFalse(err, '북마크 폴더 ' + queryFoldername + ' 조회 에러'));
            });
    }
    else {
        models.bookmark
        .findAll({ //사용자의 모든 북마크 리스트 조회
            where: {
                user_id: req.body.user_id
            }
        })
        .then(function (data) {
            console.dir(data);
            console.log('사용자 ' + req.body.user_id +  '의 모든 북마크 리스트 조회 완료.');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            console.log(req.body.user_id +  '의 모든 북마크 리스트 조회 에러.');
            res.status(500);
            res.json(util.successFalse(err, req.body.user_id +  '의 모든 북마크 리스트 조회 에러.'));
        });
    }

};

exports.bookmarkDetail = (req, res) => {
    console.log('북마크 정보 조회 호출됨.');
    models.bookmark
        .findOne({
            where: {
                id: req.params.bookmarkid,
                user_id: req.body.user_id
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
            console.log('북마크 조회 에러');
            res.status(500);
            res.json(util.successFalse(err, '북마크 조회 에러'));
        });
};

exports.bookmarkFolderModify = (req, res) => {
    console.log('북마크 폴더 수정 호출됨.');
    models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .update({
            folder_name: req.body.after_name
        },{
            where: {
                user_id: req.body.user_id, // userid와 혼동하지 말것
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
};

exports.bookmarkModify = (req, res) => {
    console.log('개별 북마크 수정 호출됨.');
    models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .update({
            folder_name: req.body.folder_name,
            item_id: req.body.item_id,
            item_title: req.body.item_title,
            item_type: req.body.item_type
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
};

exports.bookmarkFolderDelete = (req, res) => {
    console.log('북마크 폴더 삭제 호출됨.');

    var queryFoldername = querystring.unescape(req.query.foldername);
    models.bookmark
        .destroy({
            where: {
                user_id: req.body.user_id,
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

    models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .destroy({
            where: {
                id: req.params.bookmarkid, // userid와 혼동하지 말것
                user_id: req.body.user_id
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