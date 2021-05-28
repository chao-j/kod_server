const { sendMail } = require('../mailer/mailer.js');

function sendCheckCode(to, code) {
  // return new Promise((resolve, reject) => {
  //   resolve(true)
  // })
  // 测试时先关闭发送;
  return sendMail({
    to,
    subject: '查收验证码',
    html: `<div>
    <p>您正在进行账号操作，验证码：</p>
    <p style="color:red">${code}</p>
    <p style="color:#888888">* 30分钟内有效，如非您本人操作，请忽略</p>
    <p style="color:#888888">* 邮件由系统自动发送，请勿回复</p>
    </div>`,
  });
}

function createCheckCode(len = 4, hasLetter = true) {
  // 字符来源 排除 0 o O I l 1 等易混淆字符
  const digit = '23456789';
  const lowcase = 'abcdefghjkmnpqrstuvwxyz';
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const source = digit + (hasLetter ? lowcase + uppercase : '');
  let result = '';
  const range = source.length;
  for (let i = 0; i < len; i++) {
    let index = Math.floor(Math.random() * range);
    result += source[index];
  }
  return result;
}

module.exports = { sendCheckCode, createCheckCode };
