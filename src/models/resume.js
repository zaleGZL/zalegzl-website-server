const mongoose = require('mongoose')
const Schema = mongoose.Schema

const resumeSchema = new Schema({
  name: String, // 姓名
  markdownContent: String, // 简历内容(markdown形式)
  htmlContent: String // 简历内容(html形式)
})

module.exports = mongoose.model('Resume', resumeSchema)
