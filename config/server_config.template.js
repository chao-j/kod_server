const SERVER_CONFIG = {
  // token秘钥
  tokenSecret: 'xxxxxx',
  // 忽略token验证的路由
  tokenIgnorePath: [],
  // 邮件发送配置
  smtp: {
    user: 'xxxx@xxx.com',
    pass: 'XXXXXXXXXXXXX',
  },
}

module.exports = {
  SERVER_CONFIG,
}
