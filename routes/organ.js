var express = require('express');
var router = express.Router();

const responseModel = require('../utils/responseModel');
const { getToken, parseToken, decodeToken } = require('../utils/token/token');
const OrganDB = require('../utils/database/organ');

// 注册或设置机构资料
router.post('/syncOrgan', async (req, res) => {
  const uid = decodeToken(req)?.id;
  if (!uid) {
    res.json({ ...responseModel.FAIL.INVALID_TOKEN, msg: '未登录' });
    return;
  }
  const { name, intro, addr, logo, isRegister } = req.body;
  res.json(await OrganDB.syncOrgan({ name, uid, intro, addr, logo, isRegister }));
});

// 获取机构信息
router.post('/getOrganInfo', async (req, res) => {
  const { oid, isOwner } = req.body;
  const uid = decodeToken(req)?.id;
  if (isOwner && !uid) {
    res.json({ ...responseModel.FAIL.INVALID_TOKEN, msg: '未登录' });
    return;
  }
  res.json(await OrganDB.getOrganInfo({ oid, uid, isOwner }));
});

// 注销机构
router.post('/deleteOrgan', async (req, res) => {
  const uid = decodeToken(req)?.id;
  if (!uid) {
    res.json({ ...responseModel.FAIL.INVALID_TOKEN, msg: '未登录' });
    return;
  }
  res.json(await OrganDB.deleteOrgan(uid));
});

// 获取指定活动页面
router.get('/activity', async (req, res) => {
  const { id } = req.query;
  res.send(await OrganDB.getActicityPage(id));
});

// 发布活动
router.post('/addActivity', async (req, res) => {
  const { summary, html } = req.body;
  const uid = decodeToken(req)?.id;
  if (!uid) {
    res.json({ ...responseModel.FAIL.INVALID_TOKEN, msg: '未登录' });
    return;
  }
  res.json(await OrganDB.addActivity(uid, summary, html));
});

module.exports = router;
