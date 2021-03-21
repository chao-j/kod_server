# 毕设项目 api 接口服务

#### 忽略文件

- 服务器配置

  为了隐藏服务器配置信息，重要文件已添加`.gitignore`忽略，被忽略的文件有对应的`xxx.template.js`版本参考

  - `./config/server_config.template.js`是全局配置文件`./config/server_config.js`的模板

#### 关键中间件

- express-jwt
  `express-jwt`用于校验 token，`jsonwebtoken`用于生成 token，两者共同构成 token 验证体系
  jwt 设置和使用如下

  ```javascript
  app.use(
    expressJWT({
      secret: secretOrPrivateKey,
      algorithms: ['HS256'],
    }).unless({
      path: ['/getToken'], //除了这个地址，其他的URL都需要验证
    })
  )
  ```

  判断是否验证成功

  ```javascript
  // 注意是在app级别操作 一般放在所有请求路由之前 否则进入对应路由会抛 No authorization token was found 异常
  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      //  （ 具体的err值 见下面）
      res.status(401).send('invalid token...')
    }
    // 如果通过
    next()
  })
  ```

  在需要验证的路由中，如果 err 值满足这些条件，则表示验证失败

  - token 过期

  ```javascript
  {
    "name": "UnauthorizedError",
    "message": "jwt expired",
    "code": "invalid_token",
    "status": 401,
    "inner": {
        "name": "TokenExpiredError",
        "message": "jwt expired",
        "expiredAt": "2017-08-03T10:08:44.000Z"
    }
  }
  ```

  - token 无效

  ```javascript
  {
    "name": "UnauthorizedError",
    "message": "invalid signature",
    "code": "invalid_token",
    "status": 401,
    "inner": {
        "name": "JsonWebTokenError",
        "message": "invalid signature"
    }
  }
  ```

- jsonwebtoken

  在需要返回 token 的业务逻辑里
  **其实更好的方法是设置 header，而不是返回 data，app.js 里的 token 校验可以通过 header 刷新 token**

  ```javascript
  var jsonwebtoken = require('jsonwebtoken')
  app.get('/getToken', function (req, res) {
    res.json({
      result: 'ok',
      token: jsonwebtoken.sign(
        {
          // data
          name: 'BinMaing',
          data: '=============',
        },
        secretKey, // 秘钥
        {
          expiresIn: 60 * 1, // 过期时间
        }
      ),
    })
  })
  ```

  前端（特别是非网页程序，没有 cookie，无法使用 session）需要保存 token 的值
  在需要携带 token 的路径，按以下格式

  - token 要放到 authorization header 里
  - 对应的值以 Bearer 开头然后空一格，接近着是 token 值，如

  ```
  authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmluTWFpbmciLCJkYXRhIjoiPT09PT09PT09PT09PSIsImlhdCI6MTUwMTgxNDE4OCwiZXhwIjoxNTAxODE0MjQ4fQ.GoxGlc6E02W5VvqDNawaOrj3MPO-4UYeFdngKR4bVTE
  ```
