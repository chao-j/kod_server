/**
 * 开发中辅助工具
 */
// node ./developTool.js
const fs = require('fs');
const path = require('path');
// 同步配置文件
(function syncServerConfig() {
  // 得到文件内容中的每个对象
  const config = fs.readFileSync('./config/server_config.js').toString();
})();

// 统计代码行数
(() => {
  const excludes = [
    '.git',
    '.gitignore',
    'bin',
    'doc',
    'node_modules',
    'package-lock.json',
    'package.json',
    'public',
    'README.md',
  ];
  const suffix = ['.js'];
  const _LB = '\n';

  let resultStr = '======= 代码统计 =======' + _LB + new Date().toLocaleString() + _LB + _LB;
  let count = 0;
  let fileCount = 0;
  deepDir('./');

  resultStr += `======= 计入文件:${fileCount}, 共计行数:${count} ======= `;
  console.log(resultStr);

  function deepDir(p) {
    const files = fs.readdirSync(p);
    files.forEach((item) => {
      if (excludes.indexOf(item) != -1) return;
      const stats = fs.statSync(path.resolve(p, item));
      if (stats.isDirectory()) {
        deepDir(path.resolve(p, item));
      } else {
        getLineCount(path.resolve(p, item));
      }
    });
  }

  function getLineCount(file) {
    const relativePath = path.relative('./', file);
    if (suffix.indexOf(path.extname(file)) == -1) return;
    const content = fs.readFileSync(file).toString().split('\n');
    // console.log(relativePath, content.length)
    resultStr += `----${content.length} lines  ${relativePath}${_LB}`;
    count += content.length;
    fileCount++;
  }
})();
