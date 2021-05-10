const db = require('./db')
const responseModel = require('../../utils/responseModel')
const { SERVER_CONFIG } = require('../../config/server_config')

async function insertPost(imgs, content, userId) {
  const sql = 'insert into t_post_info(uc_id, pi_urls, pi_content,pi_date)values(?,?,?,?)'
  const spliter = '\v'
  const { res, err } = await db.query(sql, [userId, imgs.join(spliter), content, new Date()])
  if (err) {
    return responseModel.ERROR.DB_INSERT
  }
  return responseModel.SUCCESS.SUC_OK
}

module.exports = { insertPost }
