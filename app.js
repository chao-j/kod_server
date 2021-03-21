var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const Jwt = require('express-jwt')

const { SERVER_CONFIG } = require('./config/server_config')
const responseModel = require('./utils/responseModel')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

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
    // 如果token无效，返回
    res.status(401).json({
      ...responseModel.FAIL.INVALID_TOKEN,
      msg: `${responseModel.FAIL.INVALID_TOKEN.msg}:${err.message}`,
    })
    return
  }
  // 如果通过 刷新token
  // res.setHeader('x-kod-token', 'xxx')
  next()
})

// 路由入口
app.use('/test', indexRouter) // 测试路由
app.use('/users', usersRouter)

app.listen(8088, function () {
  console.log('kod api service listen on port 8088')
})

module.exports = app
