const Blog = require('../models/blog')
const Tag = require('../models/tags')
const Category = require('../models/categories')
const mdToc = require('markdown-toc')
const marked = require('marked')
const { markdownToHtmlRender } = require('../utils')
const { blogFields } = require('../utils')
const { APIError } = require('../utils')

// 创建新博客
const createBlog = async (ctx, next) => {
  const { title, summary, markdownContent, tags, category } = ctx.request.body

  // 检查标签是否正确
  let tagList = await Tag.find(null, 'name').exec()
  tagList = tagList.map(doc => doc.name)
  for (let i = 0, length = tags.length; i < length; i++) {
    if (tagList.indexOf(tags[i]) === -1) {
      throw new APIError('createBlog:has_error_tags')
    }
  }

  // 检查分类是否正确
  const sameCategory = await Category.find({ name: category }).exec()
  if (sameCategory === null) {
    throw new APIError('createBlog:has_error_category')
  }

  // markdownContent => toc
  const toc = marked(
    mdToc(summary + '\n\n' + markdownContent, { slugify: str => str }).content
  )

  // markdownContent => htmlContent
  const htmlContent = marked(summary + '\n\n' + markdownContent, {
    renderer: markdownToHtmlRender
  })

  // 创建新博客
  const blog = new Blog({
    title,
    summary,
    toc,
    markdownContent,
    htmlContent,
    tags,
    category
  })
  await blog.save()

  ctx.rest(null)
}

// 获取博客列表
const getBlogs = async (ctx, next) => {
  // 返回数据包含的字段
  let specificFields = null

  // 检测是否有指定返回的数据的字段
  if (Object.prototype.toString.call(ctx.query.fields) !== '[object String]') {
    // 默认或fields参数格式错误均返回所有字段
    specificFields = blogFields.join(' ')
  } else {
    // 验证返回的数据字段是否合格
    const wantReturnFields = ctx.query.fields.split(',')
    specificFields = []
    for (let i = 0, length = wantReturnFields.length; i < length; i++) {
      // 指定的字段存在
      if (blogFields.indexOf(wantReturnFields[i]) !== -1) {
        specificFields.push(wantReturnFields[i])
      }
    }
    if (specificFields.length === 0) {
      specificFields = blogFields.join(' ')
    } else {
      // _id 要特殊处理，因为默认会返回
      if (specificFields.indexOf('_id') === -1) {
        specificFields.push('-_id')
      }
      specificFields = specificFields.join(' ')
    }
  }

  // 设置返回数量限制
  let hasLimit = null
  let limit = Math.floor(ctx.query.limit)
  // limit为零无任何意义，所以 limit 为零与无limit参数一样，返回所有数据
  if (!(limit !== limit) && limit > 0) {
    hasLimit = true
  } else {
    hasLimit = false
  }

  // 设置偏移量
  let hasOffset = null
  let offset = Math.floor(ctx.query.offset)
  if (!(offset !== offset) && offset >= 0) {
    hasOffset = true
  } else {
    hasOffset = false
  }

  // 从数据库中获取博客列表信息
  let blogs = await Blog.find(null, specificFields)
    .sort({ createTime: -1 })
    .skip(hasOffset ? offset : 0)
    .limit(hasLimit ? limit : undefined)
    .exec()

  // 添加 embed 数据并响应数据
  ctx.rest({ blogs, count: blogs.length, ...ctx.state.embed })
}

// 获取博客信息
const getBlog = async (ctx, next) => {
  const id = ctx.params.id

  // 返回数据包含的字段
  let specificFields = null

  // 检测是否有指定返回的数据的字段
  if (Object.prototype.toString.call(ctx.query.fields) !== '[object String]') {
    // 默认或fields参数格式错误均返回所有字段
    specificFields = blogFields.join(' ')
  } else {
    // 验证返回的数据字段是否合格
    const wantReturnFields = ctx.query.fields.split(',')
    specificFields = []
    for (let i = 0, length = wantReturnFields.length; i < length; i++) {
      // 指定的字段存在
      if (blogFields.indexOf(wantReturnFields[i]) !== -1) {
        specificFields.push(wantReturnFields[i])
      }
    }
    if (specificFields.length === 0) {
      specificFields = blogFields.join(' ')
    } else {
      // _id 要特殊处理，因为默认会返回
      if (specificFields.indexOf('_id') === -1) {
        specificFields.push('-_id')
      }
      specificFields = specificFields.join(' ')
    }
  }

  const blog = await Blog.findById(id, specificFields).exec()

  if (blog === null) {
    throw new APIError('getBlog:not_exist_blog')
  }

  ctx.rest(blog)
}

// 更新博客
const updateBlog = async (ctx, next) => {
  const id = ctx.params.id
  const { title, summary, markdownContent, tags, category } = ctx.request.body

  // 检查标签是否正确
  let tagList = await Tag.find(null, 'name').exec()
  tagList = tagList.map(doc => doc.name)
  for (let i = 0, length = tags.length; i < length; i++) {
    if (tagList.indexOf(tags[i]) === -1) {
      throw new APIError('createBlog:has_error_tags')
    }
  }

  // 检查分类是否正确
  const sameCategory = await Category.find({ name: category }).exec()
  if (sameCategory === null) {
    throw new APIError('createBlog:has_error_category')
  }

  // markdownContent => toc
  const toc = marked(
    mdToc(summary + '\n\n' + markdownContent, { slugify: str => str }).content
  )

  // markdownContent => htmlContent
  const htmlContent = marked(summary + '\n\n' + markdownContent, {
    renderer: markdownToHtmlRender
  })

  // 直接更新博客
  const blog = await Blog.findByIdAndUpdate(id, {
    title,
    summary,
    toc,
    markdownContent,
    htmlContent,
    tags,
    category
  }).exec()

  ctx.rest(null)
}

// 删除博客
const deleteBlog = async (ctx, next) => {
  const id = ctx.params.id

  // 检查该博客是否存在
  const sameIdBlog = await Blog.findById(id).exec()
  if (sameIdBlog === null) {
    throw new APIError('deleteBlog:not_exist_blog')
  }

  await Blog.deleteOne({ _id: id }).exec()

  ctx.rest(null)
}

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  getBlog
}
