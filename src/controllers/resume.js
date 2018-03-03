const fs = require('fs')
const path = require('path')
const Resume = require('../models/resume')
const marked = require('marked')
const { markdownToHtmlRender, APIError } = require('../utils')

const info = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../privateInfo.json')).toString()
)
const adminAccount = info.adminAccount

// 获取简历
const getResume = async (ctx, next) => {
  const resume = await Resume.findOne(
    { name: adminAccount },
    '-_id htmlContent'
  ).exec()
  if (resume === null) {
    throw new APIError('resume:not_exist_resume')
  }

  ctx.rest(resume)
}

// 上传或更新简历
const createOrUpdateResume = async (ctx, next) => {
  const { markdownContent } = ctx.request.body

  // markdownContent => htmlContent
  const htmlContent = marked(markdownContent, {
    renderer: markdownToHtmlRender
  })

  // 查询数据中是否已经存在了，不存在则创建，存在则更新
  const sameNameResume = await Resume.findOne({ name: adminAccount }).exec()

  if (sameNameResume !== null) {
    // 存在，直接更新
    sameNameResume.markdownContent = markdownContent
    sameNameResume.htmlContent = htmlContent
    await sameNameResume.save()
  } else {
    // 不存在 直接创建
    const resume = new Resume({
      name: adminAccount,
      markdownContent,
      htmlContent
    })
    await resume.save()
  }

  ctx.rest(null)
}

module.exports = { getResume, createOrUpdateResume }
