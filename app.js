const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Jwt = require('express-jwt');

const { SERVER_CONFIG, ENV_TYPE } = require('./config/server_config');
const responseModel = require('./utils/responseModel');
const Debug = require('./utils/debug/debug');
const { startSocket } = require('./utils/socketUtil');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const commonRouter = require('./routes/common');
const organRouter = require('./routes/organ');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// token 设置
app.use(
  Jwt({
    secret: SERVER_CONFIG.tokenSecret,
    algorithms: ['HS256'], // 加密算法
  }).unless({
    // 排除的路由
    path: SERVER_CONFIG.tokenIgnorePath,
  })
);

// 测试阶段允许跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'content-type,authorization,Access-Control-Allow-Origin,x-kod-token');
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  // if (req.method.toLowerCase() == 'options') res.json({ code: 200, msg: 'options success' });
  // //让options尝试请求快速结束
  // else next();
  next();
});

// token 校验 在所有路由之前
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    Debug.log(err, 'token错误: ' + req.path);
    // 如果token无效，返回
    res.status(401).json({
      ...responseModel.FAIL.INVALID_TOKEN,
      msg: '未登录',
    });
    return;
  }
  // 更新token方法
  // 1.如果通过 刷新token, 客户端每次发现token更新，都存储一遍，但是这样明显太冗余
  // 2.每次用户第一次打开app，主动请求刷新一次token
  // res.setHeader('x-kod-token', 'xxx')
  next();
});

// 路由入口
app.use('/test', indexRouter); // 测试路由
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/common', commonRouter);
app.use('/organ', organRouter);
/**
 * 全局未捕获reject处理
 */
process.on('unhandledRejection', (reason, p) => {
  // 此时只能让请求超时
  Debug.log(reason, '未捕获的reject');
});

/**
 * 全局未捕获错误处理
 */
app.use(function (err, req, res, next) {
  if (err) {
    let data = {};
    if (SERVER_CONFIG.env != ENV_TYPE.RELEASE) {
      data = {
        err: err.message,
        stack: err.stack,
      };
    }
    res.json({
      code: 500,
      msg: '服务器错误',
      data,
    });
    return;
  }
  next();
});

const server = app.listen(8088, function () {
  console.log('kod api service listen on 8088');
});

// socket
const io = require('socket.io').listen(server);
startSocket(io);
module.exports = app;
