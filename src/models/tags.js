const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema({
  name: String // 标签显示的名称(无任何格式限制)
})

module.exports = mongoose.model('Tag', tagSchema)