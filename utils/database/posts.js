const db = require('./db');
const responseModel = require('../../utils/responseModel');
const { SERVER_CONFIG } = require('../../config/server_config');
const spliter = '\v';

// 插入动态
async function insertPost(imgs, content, userId) {
  // const sql = 'insert into t_post_info(uc_id, pi_urls, pi_content,pi_date)values(?,?,?,?)';
  const sql = 'insert into t_content(uc_id,c_content,c_urls,c_date,c_tags)values(?,?,?,?,?)';
  const { res, err } = await db.query(sql, [userId, content, imgs.join(spliter), new Date(), '']);
  console.log(imgs, imgs.join(spliter));
  if (err) {
    return responseModel.ERROR.DB_INSERT;
  }
  return responseModel.SUCCESS.SUC_OK;
}

// 插入视频
async function insertVideo({ url, title, desc, tags, id }) {
  // const sql = 'insert into t_video_info(uc_id, vi_url, vi_title, vi_desc, vi_date, vi_tags)values(?,?,?,?,?,?)';
  const sql = 'insert into t_content(uc_id,c_title,c_content,c_urls,c_date,c_tags,c_type)values(?,?,?,?,?,?,?)';
  const params = [id, title, desc, url, new Date(), tags.join(spliter), 1];
  const { res, err } = await db.query(sql, params);
  if (err) {
    return responseModel.ERROR.DB_INSERT;
  }
  return responseModel.SUCCESS.SUC_OK;
}

async function deleteContent(cids) {
  const sql = 'delete from t_content where c_id in (?);';
  const { res, err } = await db.query(sql, cids.join(','));
  if (err) {
    return responseModel.ERROR.DB_UPDATE;
  }
  return responseModel.SUCCESS.SUC_OK;
}

// 获取内容列表
async function getContent({ id, start, len, contentID }) {
  let sql, result;
  console.log(contentID);
  if (contentID == undefined) {
    // 获取全部列表 或者 指定用户列表
    sql = 'select * from v_contents ' + (id ? 'where uc_id = ?' : '') + ' limit ?,?';
    result = await db.query(sql, id ? [id, Number(start), Number(len)] : [Number(start), Number(len)]);
  } else {
    // 获取指定内容
    sql = 'select * from v_contents where c_id = ?';
    result = await db.query(sql, [contentID]);
  }

  const { res, err } = result;

  if (err) {
    console.log(err);
    return responseModel.ERROR.DB_QUERY;
  }
  const contents = [];
  res.forEach((item, index) => {
    const ct = {
      uid: item.uc_id,
      nickname: item.ui_nickname,
      gender: item.ui_gender,
      avatar: item.ui_avatar,
      dance_type: item.ui_dance_type,
      dance_age: item.ui_dance_age,
      birth: item.ui_birth,
      city: item.ui_city,
      cid: item.c_id,
      type: item.c_type,
      title: item.c_title,
      content: item.c_content,
      date: item.c_date,
      tags: item.c_tags == '' ? [] : item.c_tags.split(spliter),
      comments: item.c_comments,
    };
    if (item.c_type == 0) {
      ct.imgs = item.c_urls == '' ? [] : item.c_urls.split(spliter);
    } else if (item.c_type == 1) {
      ct.poster = item.c_urls + '_poster.jpg';
      ct.video = item.c_urls + '_cut.mp4';
    }
    contents.push(ct);
  });
  return { ...responseModel.SUCCESS.SUC_OK_DATA, data: contents };
}
// 发布一条评论
async function addComment(userId, contentId, targetId, toID, content) {
  const sql = 'insert into t_comment(c_id, uc_id, tc_target, tc_to, tc_content, tc_date)values(?,?,?,?,?,?)';
  const params = [contentId, userId, targetId, toID, content, new Date()];
  const { res, err } = await db.query(sql, params);
  if (err) {
    console.log(err);
    return responseModel.ERROR.DB_INSERT;
  }
  return responseModel.SUCCESS.SUC_OK;
}

// 获取指定动态评论
async function getCommentByID(id) {
  const sql = 'select i.ui_nickname, c.* from t_user_info as i, t_comment as c where c_id = ? and i.uc_id = c.uc_id';
  const { res, err } = await db.query(sql, [id]);
  if (err) {
    return { ...responseModel.ERROR.DB_QUERY, msg: '获取评论出错' };
  }
  // 构建依赖关系
  const comments = {};
  const relativeMap = {};
  const idToName = {};
  res.forEach((item) => {
    const {
      ui_nickname: nickname,
      tc_id: id,
      c_id: cid,
      uc_id: uid,
      tc_target: target,
      tc_content: content,
      tc_date: date,
      tc_status: status,
    } = item;
    const temp = { nickname, id, cid, uid, content, date, target, status };
    idToName[id] = nickname;
    if (target == -1) {
      comments[id] = { ...temp, relatives: [] };
    } else {
      if (comments.hasOwnProperty(target + '')) {
        comments[target].relatives.push({ ...temp, toName: idToName[target] });
        relativeMap[id] = target;
      } else {
        const root = relativeMap[target];
        relativeMap[id] = root;
        comments[root].relatives.push({ ...temp, toName: idToName[target] });
      }
    }
  });
  return { ...responseModel.SUCCESS.SUC_OK_DATA, data: comments };
}

async function syncComment(cids, state) {
  const params = [state];
  const sql = `update t_comment set tc_status = ? where tc_id in (${cids.join(',')})`;

  console.log(params);
  const { res, err } = await db.query(sql, params);
  if (err) {
    console.log(err);
    return { ...responseModel.ERROR.DB_UPDATE, msg: '同步评论失败' };
  }
  return responseModel.SUCCESS.SUC_OK;
}

// 获取指定账号未读评论
async function getUnreadComment(uid) {
  const sql =
    'select c.*, u.ui_nickname, u.ui_avatar from t_comment as c, t_user_info as u where tc_to = ? and tc_status = 0 and c.uc_id = u.uc_id and c.tc_to != c.uc_id order by tc_date desc';
  const { err, res } = await db.query(sql, [uid]);
  if (err) {
    return {};
  }
  const comments = {};
  res.forEach((item) => {
    comments[item.tc_id] = {
      commentID: item.tc_id,
      contentID: item.c_id,
      uid: item.uc_id,
      content: item.tc_content,
      date: item.tc_date,
      nickname: item.ui_nickname,
      avatar: item.ui_avatar,
      target: item.tc_target,
    };
  });
  return comments;
}

module.exports = {
  insertPost,
  insertVideo,
  getContent,
  addComment,
  getCommentByID,
  syncComment,
  deleteContent,
  getUnreadComment,
};
