var express = require('express')
var router = express.Router()

const responseModel = require('../utils/responseModel')
const {
  sendCheckCode,
  createCheckCode,
} = require('../utils/mailer/registerMail')
const { getToken } = require('../utils/token/token')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

/**
 * 请求发送一个验证码到邮箱
 */
router.post('/getCheckCode', (req, res) => {
  const { count } = req.body
  const code = createCheckCode()
  sendCheckCode(count, code)
    .then((result) => {
      res.json({ ...responseModel.SUCCESS.SUC_OK, msg: '验证码发送成功' })
    })
    .catch((err) => {
      res.json({ ...responseModel.ERROR.REQUEST_ERR, msg: '验证码发送失败' })
    })
})

/**
 * 用户注册接口
 */
router.post('/register', (req, res) => {
  // const { count, pwd }
  res.json({ name: 'zzz' })
})

module.exports = router
