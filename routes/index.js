var express = require('express')
const jsonwebtoken = require('jsonwebtoken')
const { SERVER_CONFIG } = require('../config/server_config')
const responseModel = require('../utils/responseModel')
var router = express.Router()
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

// 测试token生成
router.post('/getToken', (req, res) => {
  res.json({
    ...responseModel.SUCCESS.SUC_OK_DATA,
    data: {
      token: jsonwebtoken.sign(
        {
          name: 'zcj',
          count: '2516304799@qq.com',
          uId: 'xxx1',
        },
        SERVER_CONFIG.tokenSecret,
        {
          expiresIn: 60 * 2,
        }
      ),
    },
  })
})

// 测试token获取
router.post('/checkToken', (req, res) => {
  res.json({ ...responseModel.SUCCESS.SUC_OK })
})
module.exports = router
