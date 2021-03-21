const nodemailer = require('nodemailer')
const smtp = require('nodemailer-smtp-transport')
const { SERVER_CONFIG } = require('../../config/server_config.js')

const transport = nodemailer.createTransport(
  smtp({
    host: 'smtp.163.com', // 主机
    secure: true, // ssl
    secureConnection: true, // ssl
    port: 465,
    auth: SERVER_CONFIG.smtp,
  })
)

/**
 *
 * @param {Object} options 发送内容配置
 * @param {string} options.to 邮件接受者
 * @param {string} options.subject 邮件主题
 * @param {string} options.text 邮件纯文本内容
 * @param {string} options.html 邮件html内容
 */
function sendMail(options) {
  const config = {
    from: '"kod_service"xsdxs_club@163.com',
    ...options,
  }

  return new Promise((reslove, reject) => {
    transport.sendMail(config, (err, res) => {
      if (err) {
        reject(err)
      } else {
        reslove(res)
      }
    })
  })
}

module.exports = { sendMail }
