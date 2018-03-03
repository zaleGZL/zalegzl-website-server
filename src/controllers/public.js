const { APIError } = require('../utils')
const Tag = require('../models/tags')
const Category = require('../models/categories')
const Blog = require('../models/blog')

// 自动装载相关数据
// 目前只支持 标签列表(tags), 分类列表(categories) 以英文逗号分隔
// 并将数据挂在 ctx.state.embed 对象上
const embedRelativeData = async (ctx, next) => {
  ctx.state.embed = {}

  // 检测是否需要数据
  if (Object.prototype.toString.call(ctx.query.embed) !== '[object String]') {
    return next()
  }

  // 获取希望注入的数据
  const embed = ctx.query.embed.split(',')

  // 根据目前所能支持的数据进行注入

  // 标签列表
  if (embed.indexOf('tags') !== -1) {
    const tags = await Tag.find(null, '-_id name').exec()
    ctx.state.embed.tags = tags.map(doc => doc.name)
    // ctx.state.embed.tags = await Tag.find(null, '-_id name').exec()
  }

  // 分类列表
  if (embed.indexOf('categories') !== -1) {
    const categories = await Category.find(null, '-_id name').exec()
    ctx.state.embed.categories = categories.map(doc => doc.name)
    // ctx.state.embed.categories = await Category.find(null, '-_id name').exec()
  }

  return next()
}

// 获取网站概况(博客、标签、分类的数量)
const getProfileInfo = async (ctx, next) => {
  const blogCount = await Blog.count().exec()
  const tagCount = await Tag.count().exec()
  const categoryCount = await Category.count().exec()

  ctx.rest({ blogCount, tagCount, categoryCount })
}

module.exports = {
  embedRelativeData,
  getProfileInfo
}
