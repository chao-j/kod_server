var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
var formidable = require('formidable');

const responseModel = require('../utils/responseModel');
const { getToken, parseToken, decodeToken } = require('../utils/token/token');
const { createCheckCode } = require('../utils/mailer/registerMail');
const { videoPostHanlder } = require('../utils/ffmpegUtil');
/**
 * 获取城市列表
 */
router.get('/getCities', (req, res) => {
  const file = path.resolve(__dirname, '../public/jsonfile/cities.json');
  fs.readFile(file, (err, data) => {
    if (err) {
      res.json({ ...responseModel.ERROR.REQUEST_ERR, msg: '获取城市列表失败1', err });
      return;
    }
    try {
      const jsonObj = JSON.parse(data.toString());
      // 1.过滤市下面的区 减少数据量
      // 2. 市转换为对象，便于搜索

      const provinces = new Array();
      const cities = {};
      jsonObj.forEach((item) => {
        provinces.push(item.name);
        cities[item.name] = item.city.map((c) => c.name);
      });
      res.json({ ...responseModel.SUCCESS.SUC_OK_DATA, msg: '获取城市列表成功', data: { provinces, cities } });
    } catch (e) {
      res.json({ ...responseModel.ERROR.REQUEST_ERR, msg: '获取城市列表失败2', e });
    }
  });
});

/**
 * 文件上传
 */
router.post('/uploadFile', (req, resp) => {
  const { type, oldName, start, end, poster } = req.query;
  const dirs = {
    avatar: 'avatar',
    posts: 'post_imgs',
    videos: 'videos',
  };
  const filePath = path.join(__dirname, `../public/${dirs[type]}/`);
  let form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.keepExtensions = true;
  form.uploadDir = filePath;

  form.parse(req, (err, fileds, files) => {
    if (err) {
      resp.json({ ...responseModel.ERROR.REQUEST_ERR, msg: '文件上传出错' });
      return;
    }
    let fileName = files.file.path;
    // -- 针对不同文件进行不同处理
    switch (type) {
      case dirs.avatar:
        // 头像 将原有头像删除 新头像增加后缀 强制前端不使用缓存
        const { id } = decodeToken(req);
        let foldName = filePath + oldName;
        fileName = `${filePath}avatar_${id}_${createCheckCode(4)}.jpg`;
        if (fs.existsSync(foldName) && foldName !== 'default.png') {
          fs.rmSync(foldName);
        }

        fs.renameSync(files.file.path, fileName);
        break;
      case dirs.videos:
        // 视频 后端进行裁剪和封面提取
        videoPostHanlder(fileName, start, end, poster);
        break;
    }

    resp.json({
      ...responseModel.SUCCESS.SUC_OK_DATA,
      msg: '文件上传成功',
      data: {
        // file 这个键名来自前端设置
        path: path.basename(fileName),
      },
    });
  });
});

module.exports = router;
