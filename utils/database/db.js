const mysql = require('mysql');
const { SERVER_CONFIG } = require('../../config/server_config');

const pool = mysql.createPool(SERVER_CONFIG.database);

function query(sql, params) {
  return new Promise((resolve, resject) => {
    // 即使出现错误，也使用resolve，外部await语句根据err对象判断结果，避免出现大量try...catch
    if (!pool) {
      resolve({ err: { msg: 'db pool is empty' } });
    } else {
      pool.getConnection((err, conn) => {
        if (err) {
          resolve({ err: { msg: 'get conn error' } });
        } else {
          conn.query(sql, params, (err, res, fields) => {
            resolve({ err, res, fields });
          });
        }
        // 解决连接池卡死
        pool.releaseConnection(conn);
      });
    }
  });
}

module.exports = { query };
