var express = require('express')
var router = express.Router()
var formidable = require('formidable')
var path = require('path')
const responseModel = require('../utils/responseModel')
const { decodeToken, getToken } = require('../utils/token/token')
const PostDB = require('../utils/database/posts')

/**
 * 上传图片
 */
// router.post('/uploadImg', function (req, resp) {
//   let form = new formidable.IncomingForm()
//   form.encoding = 'utf-8'
//   form.keepExtensions = true
//   form.uploadDir = path.join(__dirname, '../public/posts/')
//   form.parse(req, (err, fileds, files) => {
//     console.log(files, '---')
//     if (err) {
//       resp.json({ ...responseModel.ERROR.REQUEST_ERR, msg: '图片上传出错' })
//       return
//     }
//     resp.json({
//       ...responseModel.SUCCESS.SUC_OK_DATA,
//       msg: '图片上传成功',
//       data: {
//         // file 这个键名来自前端设置
//         path: path.basename(files.file.path),
//       },
//     })
//   })
// })

/**
 * 发布帖子
 */
router.post('/addPost', async function (req, res) {
  const { imgs = [], content } = req.body
  const userInfo = decodeToken(req)
  res.json(await PostDB.insertPost(imgs, content, userInfo.id))
})

module.exports = router
