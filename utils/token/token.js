const jsonwebtoken = require('jsonwebtoken');
const { SERVER_CONFIG } = require('../../config/server_config');
/**
 * 根据数据和过期时间 返回一个token
 * @param {Object} data
 * @param {number | string} expiresIn
 * @returns
 */
function getToken(data, expiresIn = '5d') {
  return jsonwebtoken.sign(data, SERVER_CONFIG.tokenSecret, {
    expiresIn,
  });
}

/**
 * 验证并解析token
 * @param {string} token 已经去掉 `Bearer ` 头的token字符串
 * @returns
 */
function parseToken(token) {
  try {
    // const str = jsonwebtoken.decode(token)
    return jsonwebtoken.verify(token, SERVER_CONFIG.tokenSecret);
  } catch (err) {
    return null;
  }
}

/**
 * 获取token信息
 * @param req request对象
 */
function decodeToken(req) {
  let tokenStr = req.headers.authorization;
  if (!tokenStr) {
    return null;
  }
  if (tokenStr.indexOf(' ') != -1) {
    tokenStr = tokenStr.split(' ')[1];
  }
  return parseToken(tokenStr);
}

module.exports = { getToken, parseToken, decodeToken };
