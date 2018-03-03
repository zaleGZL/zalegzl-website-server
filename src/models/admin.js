const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const info = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../privateInfo.json')).toString()
)
const secret = info.secret

// 明文 ==> 加密后的字符串
const hash = plainText =>
  crypto
    .createHmac('sha256', secret)
    .update(plainText)
    .digest('hex')

const adminSchema = new Schema({
  account: String, // 账号
  password: {
    // 密码
    type: String,
    set: hash
  }
})

// 密码验证
adminSchema.methods.isCorrectPassword = function(password) {
  const hashPassword = hash(password)
  if (this.password === hashPassword) {
    return true
  } else {
    return false
  }
}

module.exports = mongoose.model('Admin', adminSchema)
