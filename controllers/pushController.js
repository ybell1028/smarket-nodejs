var admin = require("firebase-admin");
var serviceAccount = require('../config/smarket-6c5d1-firebase-adminsdk-pa9i0-f3d30d4ba8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarket-6c5d1.firebaseio.com"
});

exports.sendPush = (req, res) => {

  var pushToken = req.headers['x-push-token'];

  // 보낼 메시지를 작성하는 부분 입니다.
  var message = {
    data: {
      title: req.body.pushtitle,
      body: req.body.pushbody
    },
    token: pushToken
  };
  
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('푸시 메세지 전송 성공 : ', response);
      res.status(200);
      res.send('푸시 메세지 전송 성공');
    })
    .catch((err) => {
      console.log('푸시 메세지 전송 중 에러 발생', error);
      res.status(500);
      res.send(err);
    });
}


exports.receiveToken = (req, res) => {
  var pushToken = req.body.token;
  console.log(pushToken);
}