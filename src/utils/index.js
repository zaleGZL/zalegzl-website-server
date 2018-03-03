const markdownToHtmlRender = require('./markdownToHtmlRender')

// API错误对象的构造函数
const APIError = function(code) {
  this.errorType = 'APIError'
  this.code = code
}

// 判断一个变量是否为对象
const isObject = variable =>
  Object.prototype.toString.call(variable) === '[object Object]'

const blogFields = [
  '_id',
  'title',
  'summary',
  'toc',
  'markdownContent',
  'htmlContent',
  'createTime',
  'viewTimes',
  'tags',
  'category'
]

module.exports = {
  APIError,
  isObject,
  markdownToHtmlRender,
  blogFields
}
