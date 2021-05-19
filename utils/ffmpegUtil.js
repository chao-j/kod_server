const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const { SERVER_CONFIG, ENV_TYPE } = require('../config/server_config');

const deskPrefix = SERVER_CONFIG.env == ENV_TYPE.DEVELOP ? 'D:\\ffmpeg\\bin\\' : '';

// 截取指定视频 指定时长出帧作为封面图片
function getVideoPoster(fileName, pos) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(`${fileName}_poster.jpg`)) {
      fs.rmSync(`${fileName}_poster.jpg`);
    }
    const cmd = `${deskPrefix}ffmpeg -ss ${pos} -i ${fileName} -y -f image2 -t 0.001 ${fileName}_poster.jpg`;
    child_process.exec(cmd, {}, (err, stdout, stderr) => {
      if (!err) {
        resolve({ success: true, data: {} });
      } else {
        resolve({ success: false, err });
      }
    });
  });
}

// 截取视频片段
// ffmpeg -ss 10 -t 15 -accurate_seek -i test.mp4 -codec copy -avoid_negative_ts 1 cut.mp4
function cutVideo(fileName, start, end) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(`${fileName}_cut.mp4`)) {
      fs.rmSync(`${fileName}_cut.mp4`);
    }
    const cmd = `${deskPrefix}ffmpeg -ss ${start} -t ${end} -accurate_seek -i ${fileName} -codec copy -avoid_negative_ts 1 ${fileName}_cut.mp4`;
    child_process.exec(cmd, {}, (err, stdout, stderr) => {
      if (!err) {
        resolve({ success: true, data: {} });
      } else {
        resolve({ success: false, err });
      }
    });
  });
}

// 统一处理上传视频的封面和截取
function videoPostHanlder(fileName, start, end, poster) {
  return new Promise((resolve, reject) => {
    const p1 = cutVideo(fileName, start, end);
    const p2 = getVideoPoster(fileName, poster);
    Promise.all([p1, p2]).then((res) => {
      const success = res[0].success && res[1].success;
      if (success) {
        fs.rm(fileName, () => {});
      }
      resolve({ success });
    });
  });
}

module.exports = { getVideoPoster, cutVideo, videoPostHanlder };
