const querystring = require('querystring');
const util = require('../middleware/util');
const naverController = require('./naverController.js');
const models = require("../models");

exports.bookmarkCreate = (req, res) => {
    console.log('북마크 생성 호출됨.');
    models.bookmark
        .create({
            user_id: req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
            folder_name: req.body.folder_name,
            item_id: req.body.item_id,
            item_title: req.body.item_title,
            item_type: req.body.item_type,
            //item_selling은 default 값이 true로 들어가기 때문에 JSON데이터 필요 없음
        })
        .then(data => {
            console.dir(data);
            console.log('북마크 생성 성공.\n');
            res.status(201); // 201은 새로운 컨텐츠 만들기에 성공했을 때 사용. POST 메소드에 대한 응답으로 잘 어울림.
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            console.log('북마크 생성 실패.\n');
            res.status(500);
            res.json(util.successFalse(err, '북마크 생성 실패.'));
        });
};

exports.bookmarkList = (req, res) => {
    var queryFoldername = querystring.unescape(req.query.foldername); // 폴더 이름
    let promises = [];

    if (!(queryFoldername === 'null' || queryFoldername === 'undefined')) { // 폴더 이름이 빈 값이 아니라면
        console.log('폴더 ' + queryFoldername + ' 내 북마크 리스트 조회 호출됨.');
        models.bookmark
            .findAll({
                attributes: ['id', 'user_id', 'folder_name', 'item_id', 'item_title', 'item_type', 'item_selling'],
                where: {
                    user_id: req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
                    folder_name: queryFoldername
                }
            })
            .then(list => {
                isSelling(res, list, promises, null, queryFoldername);
            })
            .catch(err => {
                console.dir(err);
                console.log('폴더 ' + queryFoldername + ' 내 북마크 리스트 조회 실패.\n')
                res.status(500);
                res.json(util.successFalse(err, '폴더 "' + queryFoldername + '" 내 북마크 리스트 조회 실패.'));
            });
    }
    else {
        models.bookmark
            .findAll({ //사용자의 모든 북마크 리스트 조회
                attributes: ['id', 'user_id', 'folder_name', 'item_id', 'item_title', 'item_type', 'item_selling'],
                where: {
                    user_id: req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
                }
            })
            .then(list => { // 아직 만들지 않은 폴더라면 null값
                isSelling(res, list, promises, req.body.user_id, null);
            })
            .catch(err => {
                console.dir(err);
                console.log('사용자 ' + req.body.user_id + '의 전체 북마크 리스트 조회 실패.\n');
                res.status(500);
                res.json(util.successFalse(err, '사용자 ' + req.body.user_id + '의 전체 북마크 리스트 조회 실패.'));
            });
    }
};

exports.bookmarkFolderModify = (req, res) => {
    console.log('북마크 폴더 이름 수정 호출됨.');

    var queryFoldername = querystring.unescape(req.query.foldername);

    models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .update({
            folder_name: req.body.new_name
        },{
            where: {
                user_id: req.body.user_id, // userid와 혼동하지 말것
                folder_name: queryFoldername
            } 
        })
        .then(data => {
            console.dir(data);
            console.log('북마크 폴더 이름 수정 성공.\n');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            console.log('북마크 폴더 수정 실패.\n');
            res.status(500);
            res.json(util.successFalse(err, '북마크 폴더 이름 수정 실패.'));
        });
};

exports.bookmarkModify = (req, res) => { // 거의 안쓸 듯
    console.log('개별 북마크 수정 호출됨.');
    models.bookmark
        .update({
            user_id: req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
            folder_name: req.body.folder_name,
            item_id: req.body.item_id,
            item_title: req.body.item_title,
            item_type: req.body.item_type
        },{
            where: {id: req.params.bookmarkid} // userid와 혼동하지 말것
        })
        .then(data => {
            console.dir(data);
            console.log('개별 북마크 수정 성공.\n');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            console.log('개별 북마크 수정 실패.\n');
            res.status(500);
            res.json(util.successFalse(err, '개별 북마크 수정 실패.'));
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
            console.log('북마크 폴더 삭제 성공\n');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            console.log('북마크 폴더 삭제 실패.\n');
            res.status(500);
            res.json(util.successFalse(err, '북마크 폴더 삭제 실패.'));
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
            console.log('개별 북마크 삭제 성공.\n');
            res.status(200);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            console.log('개별 북마크 삭제 실패.\n');
            res.status(500);
            res.json(util.successFalse(err, '개별 북마크 삭제 실패.'));
        });
};


let delay = function ( timeout ) {
    return new Promise(( resolve ) => {
       setTimeout( resolve, timeout );
    });
 }

let isSelling = function (res, list, promises, id, foldername) {
    for (let i = 0; i < list.length; i++) {
        setTimeout(() => {
            if (!list[i].dataValues.item_selling) {
                item.dataValues.item_lprice = null;
                item.dataValues.item_link = null;
                item.dataValues.item_image = null;
                promises.push(list[i]);
                console.log(list[i].dataValues.item_title + "판매 종료.");
            }
            else {
                promises.push(naverController.checkItem(list[i]));
            }
            if (promises.length == list.length) {
                Promise.all(promises)
                    .then(allCheckedList => {
                        if(id === null) console.log('폴더 ' + foldername + ' 내 북마크 리스트 조회 완료.\n');
                        else if(foldername === null) console.log('사용자 ' + id + '의 전체 북마크 리스트 조회 완료.\n')
                        res.status(200);
                        res.json(util.successTrue(allCheckedList));
                    })
            }
        }, 120 * i)
    }
}