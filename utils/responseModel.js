/**
 * 前后端统一响应码，按照规范响应和判断响应
 * code 只是用于判断响应类型，不一定等于具体http响应码
 * 除了内部错误ERROR，数据错误FAIL外，其他都响应http 200
 */
const responseModel = {
  // 请求成功 code = 2xxx http = 200
  SUCCESS: {
    SUC_OK: {
      code: 200,
      msg: '操作成功',
    },
    SUC_OK_DATA: {
      code: 201,
      msg: '数据请求成功',
    },
  },

  // 请求成功，但是要求进一步验证  code = 1xxx http = 200

  // 请求成功，但是数据错误 code = 4xxx http = 200
  FAIL: {
    // token错误 此时http = 401
    INVALID_TOKEN: {
      code: 401,
      msg: 'token错误',
    },
    // 参数错误
    PARAM_ERR: {
      code: 402,
      msg: '参数错误',
    },
  },
  // 请求或服务器内部造成错误 code = 5xxx  http = 500 | 401
  ERROR: {
    UNDEFINED_API: {
      code: -999,
      msg: '未定义的api',
    },
    REQUEST_ERR: {
      code: 500,
      msg: '请求错误',
    },
    DB_INSERT: {
      code: 501,
      msg: '插入数据错误',
    },
    DB_QUERY: {
      code: 502,
      msg: '查询数据库错误',
    },
    DB_UPDATE: {
      code: 503,
      msg: '更新数据库错误',
    },
    DB_DUPLICATE: {
      code: 504,
      msg: '数据重复',
    },
  },
}

module.exports = responseModel
