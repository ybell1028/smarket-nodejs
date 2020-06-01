const querystring = require('querystring');
const util = require('../middleware/util');
const naverController = require('./naverController.js');
const models = require("../models");

exports.createBookmark = (req, res) => {
    console.log('북마크 생성 호출됨.');
    models.bookmark
        .create({
            user_id: req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
            folder_name: req.body.folder_name,
            item_alarm: req.body.item_alarm, //default 값 false
            item_title: req.body.item_title,
            item_link: req.body.item_link,
            item_image: req.body.item_image,
            item_lprice: req.body.item_lprice,
            item_mallname: req.body.item_mallname,
            item_id: req.body.item_id,
            item_type: req.body.item_type,
            item_brand: req.body.item_brand,
            item_maker: req.body.item_maker,
            item_category1 : req.body.item_category1,
            item_category2 : req.body.item_category2,
            item_category3 : req.body.item_category3,
            item_category4 : req.body.item_category4
            //item_selling은 default 값이 true로 들어가기 때문에 JSON데이터 필요 없음
        })
        .then(data => {
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

exports.createFolder = (req, res) => {
    console.log('폴더 생성 호출됨.');
    models.folder
        .create({
            user_id: req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
            folder_name: req.body.folder_name,
        })
        .then(data => {
            res.status(201); // 201은 새로운 컨텐츠 만들기에 성공했을 때 사용. POST 메소드에 대한 응답으로 잘 어울림.
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            console.log('폴더 생성 실패.\n');
            res.status(500);
            res.json(util.successFalse(err, '폴더 생성 실패.'));
        });
};

exports.bookmarkList = (req, res) => {
    var queryFoldername = querystring.unescape(req.query.foldername); // 폴더 이름
    let promises = [];

    if (!(queryFoldername === 'null' || queryFoldername === 'undefined')) { // 폴더 이름이 빈 값이 아니라면
        console.log('폴더 ' + queryFoldername + ' 내 북마크 리스트 조회 호출됨.');
        models.bookmark
            .findAll({
                where: {
                    user_id: req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
                    folder_name: queryFoldername
                }
            })
            .then(list => {
                if(list.length === 0){
                    res.status(200);
                    res.json(util.successTrue(null));
                } else {
                    isSelling(res, list, promises, req.body.user_id, queryFoldername);
                }
            })
            .catch(err => {
                console.dir(err);
                console.log('폴더 ' + queryFoldername + ' 내 북마크 리스트 조회 실패.\n')
                res.status(500);
                res.json(util.successFalse(err, '폴더 "' + queryFoldername + '" 내 북마크 리스트 조회 실패.'));
            });
    }
    else {
        console.log('사용자 ' + req.body.user_id + '의 전체 북마크 리스트 조회 호출됨.');
        models.bookmark
            .findAll({ //사용자의 모든 북마크 리스트 조회
                where: {
                    user_id: req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
                }
            })
            .then(list => { // 아직 만들지 않은 폴더라면 null값
                if(list.length === 0){
                    res.status(200);
                    res.json(util.successTrue(null));
                } else {
                isSelling(res, list, promises, req.body.user_id, null);
                }
            })
            .catch(err => {
                console.dir(err);
                console.log('사용자 ' + req.body.user_id + '의 전체 북마크 리스트 조회 실패.\n');
                res.status(500);
                res.json(util.successFalse(err, '사용자 ' + req.body.user_id + '의 전체 북마크 리스트 조회 실패.'));
            });
    }
};

exports.folderList = (req, res) => {
    console.log('폴더 리스트 조회 호출됨.');
    models.folder
        .findAll({
            where :{
                user_id: req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
            }
        })
        .then(data => {
            res.status(201);
            res.json(util.successTrue(data));
        })
        .catch(err => {
            console.dir(err);
            console.log('폴더 리스트 조회 실패.\n');
            res.status(500);
            res.json(util.successFalse(err, '폴더 리스트 조회 실패.'));
        });
};

exports.updateLprice = (req, res) => {
    console.log('북마크 최저가 정보 조회 호출됨.');
    let promises = [];
    models.bookmark // 알람 설정된 데이터들 가져오기
        .findAll({
            where: {
                user_id: req.body.user_id, // 토큰에 딸려서 옴, JSON 데이터 작성할 필요 X
                item_alarm : true
            }
        })
        .then(alarmedItems => {
            if(alarmedItems.length === 0){
                res.status(200);
                res.json(util.successTrue(null));
            } else {
                isChanged(res, alarmedItems, promises, req.body.user_id);
            }
        })
        .catch(err => {
            console.dir(err);
            console.log('알람 북마크 리스트 조회 실패.\n')
            res.status(500);
            res.json(util.successFalse(err, '알람 북마크 리스트 조회 실패.'));
        });
}

let isSelling = function (res, list, promises, id, foldername) {
    for (let i = 0; i < list.length; i++) {
        setTimeout(() => {
            if(list[i].dataValues.item_selling === true)
                promises.push(naverController.checkItem(list[i]));
            else{
                promises.push(list[i]);
                console.log(list[i].dataValues.item_title + ' 판매중지\n');
            }
            if (promises.length == list.length) {
                Promise.all(promises)
                    .then(allCheckedList => {
                        if (foldername === null)
                            console.log('사용자 ' + id + '의 전체 북마크 리스트 조회 성공.\n')
                        else
                            console.log('사용자 ' + id + '의 폴더 ' + foldername + ' 내 북마크 리스트 조회 성공.\n');
                        res.status(200);
                        res.json(util.successTrue(allCheckedList));
                    })
                    .catch(err => {
                        console.dir(err);
                        console.log('사용자 ' + id + '의 북마크 리스트 조회 실패.\n')
                        res.status(500);
                        res.json(util.successFalse(err, '사용자 ' + id + '의 북마크 리스트 조회 실패.'));
                    })
            }
        }, 120 * i)
    }
}


let isChanged = function (res, list, promises, id) {
    let originLprice = [];
    for (let i = 0; i < list.length; i++) {
        setTimeout(() => {
            originLprice.push(list[i].dataValues.item_lprice);
            promises.push(naverController.checkItem(list[i]));
            if (promises.length == list.length) {
                Promise.all(promises)
                    .then(async allCheckedList => {
                        for (let j = 0; j < allCheckedList.length; j++) {
                            allCheckedList[j].dataValues.lprice_diff = 0;
                            before = originLprice[j];
                            after = allCheckedList[j].dataValues.item_lprice;
                            if (!(before === after)) {
                                allCheckedList[j].dataValues.lprice_diff = after - before; // 결과값이 +면 상승, -면 하락
                                allCheckedList[j].dataValues.item_lprice = after;
                                await lprice(allCheckedList[j].dataValues.id, after);
                            }
                        }
                        console.log(('사용자 ' + id + '의 최저가 정보 조회 성공.\n'));
                        res.json(util.successTrue(allCheckedList));
                    }) 
                    .catch(err => {
                        console.dir(err);
                        console.log('사용자 ' + id + '의 최저가 정보 조회 실패.\n')
                        res.status(500);
                        res.json(util.successFalse(err, '사용자 ' + id + '의 최저가 정보 조회 실패.'));
                    })
            }
        }, 50 * i)
    }
}


let lprice = (bookmarkid, newLprice) => {
    models.bookmark
    .update({
        item_lprice : newLprice
    },{
        where: {
            id: bookmarkid
        }
    })
    .then(() => {
        console.log('최저가 업데이트 완료.');
    })
}

exports.updateAlarm = (req, res) => {
    console.log('알람 ON/OFF 호출됨.')
    models.bookmark
    .update({
        item_alarm : req.body.item_alarm
    },{
        where: {
            id: req.body.id, // userid와 혼동하지 말것
            user_id: req.body.user_id
        }
    })
    .then(data => {
        res.status(200);
        res.json(util.successTrue());
    })
    .catch(err => {
        console.dir(err);
        console.log('알람 업데이트 실패.\n');
        res.status(500);
        res.json(util.successFalse(err, '알람 업데이트 실패.'));
    });
};

exports.updateFolderName = (req, res) => {
    console.log('북마크 폴더 이름 수정 호출됨.');

    var queryFoldername = querystring.unescape(req.query.foldername);

    let promise1 = models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .update({
            folder_name: req.body.new_name
        },{
            where: {
                user_id: req.body.user_id, // userid와 혼동하지 말것
                folder_name: queryFoldername
            } 
        })
        
    let promise2 = models.folder // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .update({
            folder_name: req.body.new_name
        }, {
            where: {
                user_id: req.body.user_id, // userid와 혼동하지 말것
                folder_name: queryFoldername
            }
        })

    Promise.all([promise1, promise2])
        .then(data => {
            res.status(200);
            res.json(util.successTrue());
        })
        .catch(err => {
            console.dir(err);
            console.log('북마크 폴더 수정 실패.\n');
            res.status(500);
            res.json(util.successFalse(err, '북마크 폴더 이름 수정 실패.'));
        });
};

exports.updateBookmark = (req, res) => { // 거의 안쓸 듯
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

exports.deleteFolder = (req, res) => {
    console.log('북마크 폴더 삭제 호출됨.');

    var queryFoldername = querystring.unescape(req.query.foldername);
    let promise1 = models.bookmark
        .destroy({
            where: {
                user_id: req.body.user_id,
                folder_name: queryFoldername
            }
        })

    let promise2 = models.folder // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .destroy({
            where: {
                user_id: req.body.user_id, // userid와 혼동하지 말것
                folder_name: queryFoldername
            }
        })

    Promise.all([promise1, promise2])
        .then(data => {
            res.status(200);
            res.json(util.successTrue());
        })
        .catch(err => {
            console.dir(err);
            console.log('북마크 폴더 삭제 실패.\n');
            res.status(500);
            res.json(util.successFalse(err, '북마크 폴더 삭제 실패.'));
        });
};

exports.deleteBookmark = (req, res) => {
    console.log('개별 북마크 삭제 호출됨.');

    models.bookmark // 처음 만드는 기본 북마크는 클라이언트에서 설정해줘야함
        .destroy({
            where: {
                id: req.params.bookmarkid, // userid와 혼동하지 말것
                user_id: req.body.user_id
            }
        })
        .then(data => {
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