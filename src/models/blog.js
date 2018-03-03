const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
  title: String, // 标题
  summary: String, // 在首页显示的文章概要
  toc: String, // 文章的toc，用于快速索引
  markdownContent: String, // 文章内容(markdown形式)
  htmlContent: String, // 文章内容(html形式)
  createTime: { type: Date, default: Date.now }, // 创建时间
  viewTimes: { type: Number, default: 0 }, // 文章被查看的次数
  tags: [String], // 所属标签(多个)的 名称
  category: String // 所属分类(只能有一个)的 名称
})

module.exports = mongoose.model('Blog', blogSchema)