const ENV_TYPE = {
  DEVELOP: 'DEVELOP',
  TEST: 'TEST',
  RELEASE: 'RELEASE',
}

const SERVER_CONFIG = {
  // 当前环境
  env: ENV_TYPE.DEVELOP,
  // token秘钥
  tokenSecret: 'xxxxxx',
  // 忽略token验证的路由
  tokenIgnorePath: [],
  // 加密密钥和偏移量
  crypto: {
    key: 'kod_secretkey_2021_zhaocj_saxpawhqddqwpasxnwsa',
    iv: 'bzhsiioaasnqwooascw',
  },
  // 邮件发送配置
  smtp: {
    user: 'xxxx@xxx.com',
    pass: 'XXXXXXXXXXXXX',
  },
  // 数据库配置
  database: {
    host: '127.0.0.1',
    user: 'xxx',
    password: 'xxx',
    database: 'xxx',
    multipleStatements: true, // 执行是否支持多语句
  },
  dbConfig: {
    // 数据库不可逆加密密钥
    encryptKey: 'xxx',
  },
  // 一些常量
  constants: {
    codeExpiration: 1000 * 60 * 30, // 验证码过期时间 30 分钟
  },
}

module.exports = {
  ENV_TYPE,
  SERVER_CONFIG,
}
