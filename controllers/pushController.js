const admin = require("firebase-admin");
const serviceAccount = require('../config/smarket-6c5d1-firebase-adminsdk-pa9i0-f3d30d4ba8.json');
const util = require('../middleware/util');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarket-6c5d1.firebaseio.com"
});

exports.sendPush = (req, res) => {

  let pushToken = req.headers['x-push-token'];

  // 보낼 메시지를 작성하는 부분 입니다.
  let message = {
    data: {
      title: req.body.pushtitle,
      body: req.body.pushbody
    },
    token: pushToken
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
  var pushToken = req.body.token;
  console.log(pushToken);
}