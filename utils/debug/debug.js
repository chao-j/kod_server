/**
 * 开发版本日志打印
 */
const { ENV_TYPE, SERVER_CONFIG } = require('../../config/server_config')

function log(data, tag = 'log: ') {
  if (SERVER_CONFIG.env === ENV_TYPE.DEVELOP) {
    console.log(tag, data)
  }
}

module.exports = {
  log,
}
