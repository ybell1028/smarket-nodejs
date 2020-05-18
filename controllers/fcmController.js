const admin = require("firebase-admin");
const serviceAccount = require('../config/smarket-6c5d1-firebase-adminsdk-pa9i0-f3d30d4ba8.json');
const models = require("../models");
const util = require('../middleware/util');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarket-6c5d1.firebaseio.com"
});

exports.sendMessage = (req, res) => {

  let deviceToken = req.headers['x-device-token'];

  // 보낼 메시지를 작성하는 부분 입니다.
  let message = {
    data: {
      title: req.body.pushtitle,
      body: req.body.pushbody
    },
    token: deviceToken
  };
  
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('푸시 메세지 전송 성공 : ' + response + '\n');
      res.status(200);
      res.json(util.successTrue());
    })
    .catch((err) => {
      console.dir(err);
      console.log('푸시 메세지 전송 중 에러 발생.\n');
      res.status(500);
      res.json(util.successFalse(err, '푸시 메세지 전송 중 에러 발생'))
    });
}


exports.receiveToken = (req, res) => {
  models.user
    .findOne({
      attributes: ['user_id', 'device_token'],
      where: {user_id : req.body.user_id}
    })
    .then(data => {
      console.log(req.body.device_token);
      if(data.dataValues.device_token != req.body.device_token){
        let updateNum = updateToken(data.dataValues.user_id, req.body.device_token);
        console.log('디바이스 토큰 업데이트 성공.\n');
        res.status(201);
        res.json(util.successTrue(updateNum));
      }
      else {
        console.log('디바이스 토큰 일치.\n');
        res.status(200);
        res.json(util.successTrue());
      }
    })
    .catch(err => {
      console.dir(err);
      console.log('디바이스 토큰 업데이트 실패.\n');
      res.status(500);
      res.json(util.successFalse(err, '디바이스 토큰 업데이트 실패.\n'));
    })
}

let updateToken = (id, token) => {
  console.log(id);
  console.log(token);
  models.user
    .update({
      device_token: token
    },
      {
      where: {user_id : id}
    })
    .then(result => {
      return result;
    })
    .catch(err => { 
      throw err; 
    });
}

exports.selectToken = (req, res) => {
  models.user
    .findOne({
      attributes: ['user_id', 'device_token'],
      where: {user_id : req.body.user_id}
    })
    .then(data => {
      let token = {
        deviceToken: data.dataValues.device_token
      }
      console.log(req.body.user_id + ' 토큰 조회 성공.\n');
      res.status(200);
      res.json(util.successTrue(token));
    })
    .catch(err => {
      console.dir(err);
      console.log(req.body.user_id + ' 토큰 조회 실패.\n');
      res.status(500);
      res.json(util.successFalse(err, req.body.user_id + ' 토큰 조회 실패.'));
    })
}

// let selectToken = (id, token) => {
//   models.user
//     .findOne({
//       attributes: ['user_id', 'deveice_token'],
//       where: {user_id : id}
//     })
//     .then(data => {
//       return data
//     })
// }
