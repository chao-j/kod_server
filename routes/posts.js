var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
const responseModel = require('../utils/responseModel');
const { decodeToken, getToken } = require('../utils/token/token');
const PostDB = require('../utils/database/posts');

// 发布帖子
router.post('/addPost', async function (req, res) {
  const { imgs = [], content } = req.body;
  const userInfo = decodeToken(req);
  if (!userInfo) {
    res.json({ ...responseModel.FAIL.INVALID_TOKEN, msg: '未登录' });
    return;
  }
  res.json(await PostDB.insertPost(imgs, content, userInfo.id));
});

// 发布视频
router.post('/addVideo', async function (req, res) {
  const { url, title, desc, tags } = req.body;
  const userInfo = decodeToken(req);
  if (!userInfo) {
    res.json({ ...responseModel.FAIL.INVALID_TOKEN, msg: '未登录' });
    return;
  }
  res.json(await PostDB.insertVideo({ url, title, desc, tags, id: userInfo.id }));
});

// 获取个人内容（可能是用户自己或者查看他人）
router.post('/getUserContent', async function (req, res) {
  let { id } = req.body;
  if (!id) {
    // 查看自己，从token中获取信息
    const userInfo = decodeToken(req);
    if (!userInfo) {
      res.json({ ...responseModel.FAIL.INVALID_TOKEN, msg: '未登录' });
      return;
    }
    id = userInfo.id;
  }
  res.json(await PostDB.getContent({ id }));
});

// 获取动态内容
router.post('/getContent', async function (req, res) {
  const { start, len } = req.body;
  res.json(await PostDB.getContent({ id: undefined, start, len }));
});

// 对内容或评论进行评论
router.post('/addComment', async function (req, res) {
  const { cid, target, content } = req.body;
  const userInfo = decodeToken(req);
  if (!userInfo) {
    res.json({ ...responseModel.FAIL.INVALID_TOKEN, msg: '未登录' });
    return;
  }
  res.json(await PostDB.addComment(userInfo.id, cid, target, content));
});

// 获取指定动态的评论
router.post('/getCommentByID', async function (req, res) {
  const { cid } = req.body;
  res.json(await PostDB.getCommentByID(cid));
});

// 设置评论状态
// -1 删除 0 未读 1 已读
router.post('/syncComment', async function (req, res) {
  const { cids, state } = req.body;
  res.json(await PostDB.syncComment(cids, state));
});

module.exports = router;
