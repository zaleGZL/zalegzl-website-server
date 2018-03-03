const Router = require('koa-router')
const {
  getBlogList,
  getBlogAmount,
  getBlog,
  getBlogs
} = require('../controllers/blogs.js')
const { hasQsAttr } = require('../middlewares/validator')
const { embedRelativeData, getProfileInfo } = require('../controllers/public')
const { getResume } = require('../controllers/resume')

const router = new Router()

router.prefix('/api')

// GET /blogs (获取博客)
// 查询参数: embed ()

router.get('/blogs', embedRelativeData, getBlogs)

// GET /blogs/:id (获取某篇博客信息)
router.get('/blogs/:id', getBlog)

// === 简历 ====

// GET /resumes 获取简历
router.get('/resumes', getResume)

// ====站点信息====

// GET /profiles
router.get('/profiles', getProfileInfo)

module.exports = router
