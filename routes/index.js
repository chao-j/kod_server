var express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const { SERVER_CONFIG } = require('../config/server_config');
const responseModel = require('../utils/responseModel');
const { getToken, parseToken, decodeToken } = require('../utils/token/token');
const qr = require('qr-image');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json('xxx');
});

// 测试uncatch error
router.post('/error', function (req, res, next) {
  res.json({ code: 500, msg: 'xxx', data: { name } });
});

// 测试unhandle reject
router.post('/reject', async function (req, res, next) {
  // 这种情况异常在内部不会抛出 全局不能捕获
  // promise.then(() => {});
  let result = await getPromise();
  res.json({ code: 500, msg: result });
});

function getPromise() {
  return new Promise((reslove, reject) => {
    // reject(new Error('error'));
    reject('---');
  });
}

// 测试token生成
router.post('/getToken', (req, res) => {
  const { id, count } = req.body;
  res.json({
    ...responseModel.SUCCESS.SUC_OK_DATA,
    data: {
      token: jsonwebtoken.sign(
        {
          count,
          id,
        },
        SERVER_CONFIG.tokenSecret,
        {
          expiresIn: '10m',
        }
      ),
    },
  });
});

// 测试token获取
router.post('/checkToken', (req, res) => {
  // console.log(parseToken(req.headers.authorization.split(' ')[1]));
  console.log(decodeToken(req));
  res.json({ ...responseModel.SUCCESS.SUC_OK });
});

// 测试二维码
router.get('/getQR', (req, res) => {
  var code = qr.image('No authorization token was found', { type: 'png' });
  res.setHeader('Content-type', 'image/png'); //sent qr image to client side
  code.pipe(res);
});

// 一个GET请求的例子
router.get('/hello', (req, res) => {
  res.send('Hello World');
});

module.exports = router;
