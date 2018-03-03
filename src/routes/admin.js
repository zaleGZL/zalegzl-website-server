const Router = require('koa-router')
const {
  generateToken,
  checkTokenAuth,
  writeToken,
  deleteToken,
  verifyAccount,
  hasToken
} = require('../controllers/token')
const { hasAttr, hasQsAttr } = require('../middlewares/validator')

const { createTag, deleteTag, getTags } = require('../controllers/tags')
const {
  createCategory,
  deleteCategory,
  getCategories
} = require('../controllers/categories')

const { createBlog, updateBlog, deleteBlog } = require('../controllers/blogs')
const { createOrUpdateResume } = require('../controllers/resume')

const router = new Router()

// all request prefix: /admin/api
router.prefix('/admin/api')

// POST  /tokens (用于登录时的账号验证，就是获取token)
router.post(
  '/tokens',
  hasAttr('account'),
  hasAttr('password'),
  verifyAccount,
  generateToken,
  writeToken('admin')
)

// GET /tokens/:token (验证用户浏览器存储的token是否有效)
router.get(
  '/tokens/:token',
  hasToken('adminToken:not_token'),
  checkTokenAuth('admin', false)
)

// 检查查询参数或请求体中是否有token
router.use(hasToken('adminToken:not_token'))
// 验证token是否正确
router.use(checkTokenAuth('admin', true))

// delete /token (账号登出, 删除token)
router.delete('/tokens', deleteToken('admin'))

// 能访问到这里的请求必然通过管理员权限验证

/*
 * ====标签====
 */

// POST  /tags  创建新标签
router.post('/tags', hasAttr('name'), createTag)

// DELETE  /tags  删除标签(未完善)
router.delete('/tags', hasAttr('name'), deleteTag)

// GET  /tags  获取所有标签
router.get('/tags', getTags)

/*
 * ====分类====
 */

// POST  /categories  创建新分类
router.post('/categories', hasAttr('name'), createCategory)

// DELETE  /categories  删除分类(未完善)
router.delete('/categories', hasAttr('name'), deleteCategory)

// GET  /categories  获取所有分类
router.get('/categories', getCategories)

/*
 * ====发布博客====
 */

// POST /blogs 发布新的博客
router.post(
  '/blogs',
  hasAttr('title'),
  hasAttr('summary'),
  hasAttr('markdownContent'),
  hasAttr('tags', undefined, 'Array'),
  hasAttr('category'),
  createBlog
)

/*
 * ====编辑博客====
 */

// PUT /blogs 更新博客
router.put(
  '/blogs/:id',
  hasAttr('title'),
  hasAttr('summary'),
  hasAttr('markdownContent'),
  hasAttr('tags', undefined, 'Array'),
  hasAttr('category'),
  updateBlog
)

// DELETE /blogs 删除博客
router.delete('/blogs/:id', deleteBlog)

// ====简历====

// POST /resumes 创建或更新简历
router.post('/resumes', hasAttr('markdownContent'), createOrUpdateResume)

module.exports = router
