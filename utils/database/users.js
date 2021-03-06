const db = require('./db');
const responseModel = require('../../utils/responseModel');
const { SERVER_CONFIG } = require('../../config/server_config');
const DEBUG = require('../debug/debug');

/**
 * 根据指定参数查询用户信息
 * @param {*} info
 */
async function getUserInfo(info) {
  const { id, count } = info;
  let sql = 'select uc.uc_count, ui.* from t_user_count as uc, t_user_info as ui where ui.uc_id = uc.uc_id and ';
  let params = [];
  if (id) {
    sql += 'ui.uc_id = ?;';
    params = [id];
  } else if (count) {
    sql += 'uc.uc_count = ?;';
    params = [count];
  }
  if (id) {
    sql += 'select * from t_organ where uc_id = ?';
    params.push(id);
  }
  const { res, err } = await db.query(sql, params);
  if (err) {
    return { ...responseModel.ERROR.DB_QUERY, next: false };
  } else if (res.length != 0) {
    const [ui] = res[0];
    const [oi] = res[1];
    let data = {
      count: ui.uc_count,
      cid: ui.uc_id,
      avatar: ui.ui_avatar,
      birth: ui.ui_birth,
      dance_age: ui.ui_dance_age,
      dance_type: ui.ui_dance_type,
      gender: ui.ui_gender,
      uid: ui.ui_id,
      identity: ui.ui_identity,
      nickname: ui.ui_nickname,
      city: ui.ui_city,
      province: ui.ui_province,
      oid: oi?.o_id,
      oName: oi?.o_name,
    };
    return {
      ...responseModel.SUCCESS.SUC_OK_DATA,
      msg: '查询用户信息成功',
      data,
    };
  } else {
    return { ...responseModel.FAIL.PARAM_ERR, msg: '用户不存在' };
  }
}

/**
 * 插入或者更新某个账号的验证码
 * @param {string} count
 * @param {string} code
 */
async function updateCheckCode(count, code) {
  // 注意一个细节 new Date() 打印的形如 2021-03-21T11:06:06.000Z 的格林威治时区
  // 直接存入数据库，数据库会自动加上时区 即 2021-03-21 19:06:06
  // 但是node取出来的时候，还是零时区 所以无需转换（可能实际存的是毫秒数）
  let { err, res } = await db.query(`call update_checkcode(?,?,?)`, [count, code, new Date()]);
  if (err) {
    console.log(err);
    return {
      ...responseModel.ERROR.DB_INSERT,
      msg: '存入验证码错误',
      next: false,
    };
  } else {
    return { ...responseModel.SUCCESS.SUC_OK, next: true };
  }
}
/**
 * 验证验证码
 * @param {*} count
 * @param {*} code
 * @returns
 */
async function testCheckCode(count, code) {
  let { err, res } = await db.query('select * from t_user_checkcode where ucc_count = ? and ucc_code = password(?)', [
    count,
    code,
  ]);

  if (err) {
    return {
      ...responseModel.ERROR.DB_QUERY,
      msg: '数据库查询错误',
    };
  }

  if (res.length == 0) {
    return {
      ...responseModel.FAIL.PARAM_ERR,
      msg: '验证码错误',
    };
  }

  const prodTime = res[0].ucc_prodtime;
  const now = new Date();
  const interval = now - prodTime;
  if (now - prodTime > SERVER_CONFIG.constants.codeExpiration) {
    // 过期
    return {
      ...responseModel.FAIL.PARAM_ERR,
      msg: '验证码过期',
    };
  } else {
    return {
      ...responseModel.SUCCESS.SUC_OK,
      msg: '验证码正确',
    };
  }
}

/**
 * 注册
 * @param {*} count
 * @param {*} pwd
 */
async function register(count, pwd) {
  const sql = 'call insert_user(?,?,?);';
  const randomNickName = 'kod' + randomStr();
  let { res, err } = await db.query(sql, [count, pwd, randomNickName]);
  if (err) {
    return { ...responseModel.ERROR.DB_INSERT };
  }
  if (res && res[0]) {
    const { errno, id } = res[0][0];
    if (errno === -1) {
      // 注册失败：可能账号已注册，或者存储过程语句发生回滚
      return { ...responseModel.FAIL.PARAM_ERR, msg: '发生错误，该账号可能已注册' };
    } else {
      // 注册成功
      let userInfo = {
        id,
        nickname: randomNickName + id,
        gender: 0,
        birth: new Date().toLocaleDateString(),
        dance_type: 0,
        dance_age: new Date().toLocaleDateString(),
        avatar: 'default.png',
        province: '四川省',
        city: '成都市',
        identity: 0,
      };
      return { ...responseModel.SUCCESS.SUC_OK_DATA, msg: '注册成功', data: userInfo, next: true };
    }
  } else {
    return { ...responseModel.ERROR.DB_INSERT };
  }
}

async function login(count, pwd) {
  const sql =
    'select ui.* from t_user_info as ui, t_user_count as uc where uc.uc_count = ? and uc.uc_pwd = password(?) and uc.uc_id = ui.uc_id';
  const { res, err } = await db.query(sql, [count, pwd]);
  if (err) {
    return { ...responseModel.ERROR.DB_QUERY };
  } else {
    if (res.length == 0) {
      return { ...responseModel.FAIL.PARAM_ERR, msg: '账号或密码错误' };
    } else {
      const {
        uc_id: id,
        ui_nickname: nickname,
        ui_gender: gender,
        ui_birth: birth,
        ui_dance_type: dance_type,
        ui_dance_age: dance_age,
        ui_avatar: avatar,
        ui_province: province,
        ui_city: city,
        ui_identity: identity,
      } = res[0];
      let userInfo = {
        id,
        nickname,
        gender,
        birth,
        dance_type,
        dance_age,
        avatar,
        province,
        city,
        identity,
      };
      return { ...responseModel.SUCCESS.SUC_OK_DATA, msg: '登录成功', data: userInfo };
    }
  }
}

async function setUserInfo({ nickname, gender, birth, dance_type, dance_age, avatar, province, city, identity, id }) {
  let sql = 'update t_user_info set ';
  let strArr = [];
  let params = [];
  // 前端只传过来修改过的值，以此去拼接更新语句
  if (nickname) {
    strArr.push('ui_nickname = ?');
    params.push(nickname);
  }
  if (gender) {
    strArr.push('ui_gender = ?');
    params.push(gender);
  }
  if (birth) {
    strArr.push('ui_birth = ?');
    params.push(new Date(birth).toLocaleDateString());
  }
  if (dance_type) {
    strArr.push('ui_dance_type = ?');
    params.push(dance_type);
  }
  if (dance_age) {
    strArr.push('ui_dance_age = ?');
    params.push(new Date(dance_age).toLocaleDateString());
  }
  if (avatar) {
    strArr.push('ui_avatar = ?');
    params.push(avatar);
  }
  if (province) {
    strArr.push('ui_province = ?');
    params.push(province);
  }
  if (city) {
    strArr.push('ui_city = ?');
    params.push(city);
  }
  params.push(id);
  sql = sql + strArr.join(', ') + ' where uc_id = ?';
  const { res, err } = await db.query(sql, params);
  if (err) {
    if (err.errno == 1062) {
      return { ...responseModel.ERROR.DB_DUPLICATE, msg: '用户名已存在' };
    }
    return responseModel.ERROR.DB_UPDATE;
  }
  return responseModel.SUCCESS.SUC_OK;
}

function randomStr(len = 4, hasLetter = true) {
  const digit = '0123456789';
  const lowcase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = lowcase.toUpperCase();
  const source = digit + (hasLetter ? lowcase + uppercase : '');
  let result = '';
  const range = source.length;
  for (let i = 0; i < len; i++) {
    let index = Math.floor(Math.random() * range);
    result += source[index];
  }
  return result;
}

function insertMsg(id, toID, type, content, date) {
  const sql = 'insert into t_message(uc_id, m_target, m_type, m_content, m_date)values(?,?,?,?,?)';
  const params = [id, toID, type, content, date];
  db.query(sql, params);
}

async function getUnreadMsg(id) {
  const sql =
    'select m.*, target.ui_nickname as tname, target.ui_avatar as tavatar, self.ui_nickname as sname, self.ui_avatar as savatar ' +
    'from t_message as m, t_user_info as target, t_user_info as self ' +
    'where target.uc_id = m.m_target and self.uc_id = m.uc_id and (m.uc_id = ? or m_target = ?)';
  const params = [id, id];
  const { err, res } = await db.query(sql, params);
  if (err) {
    return responseModel.ERROR.DB_QUERY;
  }
  const msg = {};
  res.forEach((item) => {
    // 发送者是自己还是别人
    const type = item.uc_id == id ? 0 : 1;
    // 自己发送给某一个人的消息 也要放在该人id下 这里自己是发送还是接收 都取得对方id
    const key = type == 0 ? item.m_target : item.uc_id;
    if (!msg[key]) {
      msg[key] = [];
    }
    msg[key].push({
      id: item.m_id,
      type,
      // 当type为0时 用target显示对方信息 相反 用self显示对方信息
      targetName: item.tname,
      targetAvatar: item.tavatar,
      selfName: item.sname,
      selfAvatar: item.savatar,
      content: item.m_content,
      date: item.m_date,
      status: item.m_status,
      selfID: item.uc_id,
      targetID: item.m_target,
      msgType: item.m_type,
    });
  });
  return { ...responseModel.SUCCESS.SUC_OK_DATA, data: msg };
}

function syncMsgStatus(ids) {
  const sql = `update t_message set m_status = 1 where m_id in (${ids.join(',')})`;
  db.query(sql);
}

module.exports = {
  getUserInfo,
  updateCheckCode,
  testCheckCode,
  register,
  login,
  setUserInfo,
  insertMsg,
  getUnreadMsg,
  syncMsgStatus,
};

// (async () => {
//   login('08@qq.com', '123456');
// })();
