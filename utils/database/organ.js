const fs = require('fs');
const path = require('path');
const db = require('./db');
const responseModel = require('../../utils/responseModel');

async function syncOrgan({ isRegister, uid, name, intro, addr, logo }) {
  let sql = '';
  let params = [];
  if (isRegister) {
    sql = 'insert into t_organ(uc_id, o_name, o_intro, o_addr, o_logo)values(?,?,?,?,?)';
    params = [uid, name, intro, addr, logo];
  } else {
    const sqlArr = [];
    if (name) {
      sqlArr.push('o_name = ?');
      params.push(name);
    }
    if (intro) {
      sqlArr.push('o_intro = ?');
      params.push(intro);
    }
    if (addr) {
      sqlArr.push('o_addr = ?');
      params.push(addr);
    }
    if (logo) {
      sqlArr.push('o_logo = ?');
      params.push(logo);
    }
    sql = 'update t_organ set ' + sqlArr.join(',') + ' where uc_id = ?';
    params.push(uid);
  }
  const { res, err } = await db.query(sql, params);
  if (err) {
    return responseModel.ERROR.DB_INSERT;
  }
  return responseModel.SUCCESS.SUC_OK;
}

async function getOrganInfo({ uid, oid, isOwner }) {
  let sql = '';
  if (isOwner) {
    sql = 'select * from t_organ where uc_id = ?';
  } else {
    sql = 'select * from t_organ where o_id = ?';
  }
  const { res, err } = await db.query(sql, [isOwner ? uid : oid]);
  if (isOwner) {
    oid = res[0].o_id;
  }
  const ctSql = 'select * from t_activity where o_id = ?';
  const { res: ctRes, err: ctErr } = await db.query(ctSql, [oid]);
  const activies = [];
  ctRes.forEach((item) => {
    activies.push({
      aid: item.a_id,
      oid: item.o_id,
      summary: item.a_summary,
    });
  });
  if (err || ctErr) {
    return responseModel.ERROR.DB_QUERY;
  }
  if (res.length == 1) {
    return {
      ...responseModel.SUCCESS.SUC_OK_DATA,
      data: {
        oid: res[0].o_id,
        uid: res[0].uc_id,
        name: res[0].o_name,
        logo: res[0].o_logo,
        intro: res[0].o_intro,
        addr: res[0].o_addr,
        activies,
      },
    };
  }
  return { ...responseModel.FAIL.PARAM_ERR, msg: '没有机构' };
}

async function deleteOrgan(uid) {
  const sql = 'delete from t_organ where uc_id = ?';
  const { res, err } = await db.query(sql, [uid]);
  if (err) {
    return responseModel.ERROR.DB_UPDATE;
  }
  return responseModel.SUCCESS.SUC_OK;
}

// 获取某个活动页面
async function getActicityPage(id) {
  const html = `<h2>活动预告</h2><p><span style="text-decoration: underline;">test</span></p><p><span style="font-size: 0.8rem; font-weight: normal; text-decoration: none; background-color: rgb(255, 255, 255);">你好</span></p><p><span style="font-size: 0.8rem; font-weight: normal; text-decoration: none; background-color: rgb(255, 255, 255);">啊啊啊</span></p><p><span style="font-size: 0.8rem; font-weight: normal; text-decoration: none; background-color: rgb(255, 255, 255); color: rgb(26, 250, 41);">阿SaaS</span></p>`;
  const templateStr = fs.readFileSync(path.resolve(__dirname, '../../public/template/activity.html')).toString();
  return templateStr.replace('%slot%', html);
}

// 发布活动
async function addActivity(uid, summary, html) {
  const sql = 'insert into t_activity(o_id, a_summary, a_content, a_date) select o_id,?,? from t_organ where uc_id = ?';
  const params = [summary, html, uid, new Date()];
  const { res, err } = await db.query(sql, params);
  if (err) {
    console.log(err);
    return responseModel.ERROR.DB_INSERT;
  }
  return responseModel.SUCCESS.SUC_OK;
}

module.exports = { syncOrgan, getOrganInfo, deleteOrgan, getActicityPage, addActivity };
