const db = require('./db')
const responseModel = require('../../utils/responseModel')
const { SERVER_CONFIG } = require('../../config/server_config')
/**
 * 插入或者更新某个账号的验证码
 * @param {string} count
 * @param {string} code
 */
async function updateCheckCode(count, code) {
  // 注意一个细节 new Date() 打印的形如 2021-03-21T11:06:06.000Z 的格林威治时区
  // 直接存入数据库，数据库会自动加上时区 即 2021-03-21 19:06:06
  // 但是node取出来的时候，还是零时区 所以无需转换（可能实际存的是毫秒数）
  let { err, res } = await db.query('call update_checkcode(?,?,?)', [
    count,
    code,
    new Date(),
  ])
  if (err) {
    console.log(err)
    return {
      ...responseModel.ERROR.DB_INSERT,
      msg: '存入验证码错误',
      next: false,
    }
  } else {
    return { ...responseModel.SUCCESS.SUC_OK, next: true }
  }
}
/**
 * 验证验证码
 * @param {*} count
 * @param {*} code
 * @returns
 */
async function testCheckCode(count, code) {
  console.log(count, code)
  let {
    err,
    res,
  } = await db.query(
    'select * from t_user_checkcode where ucc_count = ? and ucc_code = ?',
    [count, code]
  )

  if (err) {
    return {
      ...responseModel.ERROR.DB_QUERY,
      msg: '数据库查询错误',
    }
  }

  if (res.length == 0) {
    return {
      ...responseModel.FAIL.PARAM_ERR,
      msg: '验证码错误',
    }
  }

  const prodTime = res[0].ucc_prodtime
  const now = new Date()
  const interval = now - prodTime
  if (now - prodTime > SERVER_CONFIG.constants.codeExpiration) {
    // 过期
    return {
      ...responseModel.FAIL.PARAM_ERR,
      msg: '验证码过期',
    }
  } else {
    return {
      ...responseModel.SUCCESS.SUC_OK,
      msg: '验证码正确',
    }
  }
}

module.exports = {
  updateCheckCode,
  testCheckCode,
}
