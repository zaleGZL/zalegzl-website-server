const Category = require('../models/categories')
const Blog = require('../models/blog')
const { APIError } = require('../utils')

// 创建新分类
const createCategory = async (ctx, next) => {
  const name = ctx.request.body.name

  // 若存在了同名的标签
  const sameCategory = await Category.findOne({ name }).exec()
  if (sameCategory !== null) {
    throw new APIError('createCategory:has_same_category_name')
  }

  const category = new Category({ name })
  await category.save()

  ctx.rest(null)
}

// 删除目录
const deleteCategory = async (ctx, next) => {
  const name = ctx.request.body.name

  // 检查目录是否存在
  const category = await Category.findOne({ name }).exec()
  if (category === null) {
    throw new APIError('deleteCategory:not_exist_category')
  }

  // 如某篇博客包含该分类，则要将对应的分类删除并归到为未分类
  const blogs = await Blog.find(null, 'category').exec()

  for (let i = 0, length = blogs.length; i < length; i++) {
    if (blogs[i].category === name) {
      blogs[i].category = '未分类'
      blogs[i].save()
    }
  }

  await Category.deleteOne({ name }).exec()

  ctx.rest(null)
}

// 获取所有分类
const getCategories = async (ctx, next) => {
  const categories = await Category.find(null, 'name').exec()
  ctx.rest(categories.map(doc => doc.name))
}

module.exports = {
  createCategory,
  deleteCategory,
  getCategories
}
