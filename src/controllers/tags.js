const Tag = require('../models/tags')
const Blog = require('../models/blog')
const { APIError } = require('../utils')

// 创建新标签
const createTag = async (ctx, next) => {
  const name = ctx.request.body.name

  // 若存在了同名的标签
  const sameTag = await Tag.findOne({ name }).exec()
  if (sameTag !== null) {
    throw new APIError('createTag:has_same_tag_name')
  }

  const tag = new Tag({ name })
  await tag.save()

  ctx.rest(null)
}

// 删除标签
const deleteTag = async (ctx, next) => {
  const name = ctx.request.body.name

  // 检查标签是否存在
  const tag = await Tag.findOne({ name }).exec()
  if (tag === null) {
    throw new APIError('deleteTag:not_exist_tag')
  }

  // 如某篇博客包含该标签，则要将对应标签删除
  const blogs = await Blog.find(null, 'tags').exec()

  for (let i = 0, length = blogs.length; i < length; i++) {
    const index = blogs[i].tags.indexOf(name)
    if (index !== -1) {
      blogs[i].tags.splice(index, 1)
      await blogs[i].save()
    }
  }

  await Tag.deleteOne({ name }).exec()

  ctx.rest(null)
}

// 获取所有标签
const getTags = async (ctx, next) => {
  const tags = await Tag.find(null, 'name').exec()
  ctx.rest(tags.map(doc => doc.name))
}

module.exports = {
  createTag,
  deleteTag,
  getTags
}
