const fs = require('fs')
// const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const Router = require('koa-router')
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const rootAPIRouter = require('./routes')
const send = require('koa-send')

const _mongodb = require('./models')

const { restify } = require('./middlewares')

const app = new Koa()

// 设置网站私有信息
const info = JSON.parse(
  fs.readFileSync(__dirname + '/privateInfo.json').toString()
)
app.data = {}
app.data.secret = info.secret

// 静态文件中间件
app.use(serve(__dirname + '/public', { maxage: 7 * 24 * 60 * 60 * 1000 }))

// 返回JSON结构的数据
app.use(json({ pretty: false }))

// 解析请求主体
app.use(bodyParser())

// 部署返回Restful API 响应的方法
app.use(restify(new RegExp('^(/admin/|/)api/')))

// API路由
app.use(rootAPIRouter.routes())

// 博客路由
const blogRouter = new Router()
blogRouter.get('/admin/*', async (ctx, next) => {
  await send(ctx, './public/admin/index.html')
})
app.use(blogRouter.routes())

// 天气项目路由
const weatherRouter = new Router()
weatherRouter.get('/simple_weather/*', async (ctx, next) => {
  await send(ctx, './public/simple_weather/index.html')
})
app.use(weatherRouter.routes())

// 博客后台路由
const blogAdminRouter = new Router()
blogAdminRouter.get('/*', async (ctx, next) => {
  await send(ctx, './public/blog/index.html')
})
app.use(blogAdminRouter.routes())

app.use(async (ctx, next) => {
  ctx.body = '404'
})

// 内部错误处理
app.on('error', function(err, ctx) {
  console.log('server error', err, ctx)
})

app.listen(4000, () => console.log('Koa app listening on 4000'))
