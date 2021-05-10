var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const Jwt = require('express-jwt')

const { SERVER_CONFIG, ENV_TYPE } = require('./config/server_config')
const responseModel = require('./utils/responseModel')
const Debug = require('./utils/debug/debug')
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var postsRouter = require('./routes/posts')
var commonRouter = require('./routes/common')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// token 设置
app.use(
  Jwt({
    secret: SERVER_CONFIG.tokenSecret,
    algorithms: ['HS256'], // 加密算法
  }).unless({
    // 排除的路由
    path: SERVER_CONFIG.tokenIgnorePath,
  })
)

// token 校验 在所有路由之前
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    Debug.log(err, 'token错误: ')
    // 如果token无效，返回
    res.status(401).json({
      ...responseModel.FAIL.INVALID_TOKEN,
      msg: `${responseModel.FAIL.INVALID_TOKEN.msg}:${err.message}，from: '${req.baseUrl}'`,
    })
    return
  }
  // 更新token方法
  // 1.如果通过 刷新token, 客户端每次发现token更新，都存储一遍，但是这样明显太冗余
  // 2.每次用户第一次打开app，主动请求刷新一次token
  // res.setHeader('x-kod-token', 'xxx')
  next()
})

// 路由入口
app.use('/test', indexRouter) // 测试路由
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/common', commonRouter)

/**
 * 全局未捕获reject处理
 */
process.on('unhandledRejection', (reason, p) => {
  // 此时只能让请求超时
  Debug.log(reason, '未捕获的reject')
})

/**
 * 全局未捕获错误处理
 */
app.use(function (err, req, res, next) {
  if (err) {
    let data = {}
    if (SERVER_CONFIG.env != ENV_TYPE.RELEASE) {
      data = {
        err: err.message,
        stack: err.stack,
      }
    }
    res.json({
      code: 500,
      msg: '服务器错误',
      data,
    })
    return
  }
  next()
})

app.listen(8088, function () {
  console.log('kod api service listen on port 8088')
})

module.exports = app
