const Router = require('koa-router')
const adminAPIRouter = require('./admin')
const publicAPIRouter = require('./public')

const rootAPIRouter = new Router()

// /admin/api
rootAPIRouter.use(adminAPIRouter.routes())

// /api
rootAPIRouter.use(publicAPIRouter.routes())

module.exports = rootAPIRouter
