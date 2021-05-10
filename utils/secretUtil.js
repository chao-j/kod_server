const CryptoJS = require('crypto-js')
const { SERVER_CONFIG } = require('../config/server_config')
const keyStr = SERVER_CONFIG.crypto.key
const ivStr = SERVER_CONFIG.crypto.iv
// 加密
function encrypt(data) {
  // 数据加密
  let encJson = CryptoJS.AES.encrypt(JSON.stringify(data), 'aes').toString()
  // 加密数据转utf8， 再转base64
  let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))

  return encData
}
// 解密
function decrypt(data) {
  //先base64还原，再转为utf8数据
  let decData = CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
  //解密数据
  let decJson = CryptoJS.AES.decrypt(decData, 'aes').toString(CryptoJS.enc.Utf8)
  return JSON.parse(decJson)
}

module.exports = { encrypt, decrypt }
