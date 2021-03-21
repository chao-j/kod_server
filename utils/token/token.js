const jsonwebtoken = require('jsonwebtoken')
const { SERVER_CONFIG } = require('../../config/server_config')
function getToken(data, expiresIn) {
  return jsonwebtoken.sign(data, SERVER_CONFIG.tokenSecret, {
    expiresIn,
  })
}

module.exports = { getToken }
