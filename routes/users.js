var express = require('express')
var router = express.Router()

const responseModel = require('../utils/responseModel')
const {
  sendCheckCode,
  createCheckCode,
} = require('../utils/mailer/registerMail')
const { getToken, parseToken } = require('../utils/token/token')
const UserDB = require('../utils/database/users')
const Debug = require('../utils/debug/debug')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

/**
 * 刷新token，每次用户第一次打开app，主动请求刷新一次token
 */
router.post('/syncToken', (req, res) => {
  const token = req.headers.authorization
  let tokenDecode = null
  // 原token是否有效
  if (token && token.indexOf('Bearer ') != -1) {
    tokenDecode = parseToken(token.split(' ')[1])
  }
  // 如果有效更新token 实际只是更新过期时间  注意 旧token并不会失效 由客户端主动更换token
  if (tokenDecode) {
    const { count, id } = tokenDecode
    const newToken = getToken({ count, id })
    res.json({
      ...responseModel.SUCCESS.SUC_OK_DATA,
      msg: '更新token',
      data: {
        token: newToken,
      },
    })
    return
  }
  res.json({ ...responseModel.FAIL.INVALID_TOKEN, msg: 'token不合法' })
})

/**
 * 请求发送一个验证码到邮箱
 */
router.post('/getCheckCode', async (req, res) => {
  const { count } = req.body
  const code = createCheckCode()
  const result = await UserDB.updateCheckCode(count, code)
  if (!result.next) {
    res.json(result)
  } else {
    sendCheckCode(count, code)
      .then((result) => {
        Debug.log(`验证码:${code} - ${count}`)
        res.json({ ...responseModel.SUCCESS.SUC_OK, msg: '验证码发送成功' })
      })
      .catch((err) => {
        res.json({ ...responseModel.ERROR.REQUEST_ERR, msg: '验证码发送失败' })
      })
  }
})

/**
 * 检验验证码
 */
router.post('/testCheckCode', async (req, res) => {
  const { count, code } = req.body
  let result = await UserDB.testCheckCode(count, code)
  res.json(result)
})

/**
 * 用户注册接口
 */
router.post('/register', (req, res) => {
  // const { count, pwd }
  res.json({ name: 'zzz' })
})

module.exports = router
