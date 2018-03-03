const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
const { APIError } = require('../utils')
const { getAsync, setAsync, delAsync } = require('../redis')

// 验证账号信息
const verifyAccount = async (ctx, next) => {
  const { account, password } = ctx.request.body

  const admin = await Admin.findOne({ account }).exec()

  if (admin === null) {
    throw new APIError('adminToken:account_not_exist')
  }

  if (!admin.isCorrectPassword(password)) {
    throw new APIError('adminToken:password_error')
  }

  ctx.state.account = admin.account

  await next()
}

// 动态生成token(包含当前时间戳)
const generateToken = async (ctx, next) => {
  const token = jwt.sign({ account: ctx.state.account }, ctx.app.data.secret)
  ctx.state.token = token
  await next()
}

// 写入token到redis中
const writeToken = type => {
  return async (ctx, next) => {
    const token = ctx.state.token
    const status = await setAsync(
      `${type}:token:${ctx.state.account}`,
      token
      // 'EX',
      // 60 * 60 * 24 * 7
    )
    if (status !== 'OK') {
      throw new APIError(`${type}Token:write_token_error`)
    }
    ctx.rest({ token })
  }
}

// 检查token是否有效
const checkTokenAuth = (type, goNext) => {
  return async (ctx, next) => {
    const token = ctx.state.token
    const payload = jwt.decode(token)
    if (payload === null) {
      throw new APIError(`${type}Token:error_token`)
    }
    const account = payload.account
    const correctToken = await getAsync(`${type}:token:${account}`)

    if (correctToken === token) {
      if (goNext === true) {
        await next()
      } else {
        ctx.rest(null)
      }
    } else {
      throw new APIError(`${type}Token:error_token`)
    }
  }
}

// 删除token(用于账号登出)
const deleteToken = type => {
  return async (ctx, next) => {
    const token = ctx.state.token
    const payload = jwt.decode(token)
    if (payload === null) {
      throw new APIError(`${type}Token:error_token`)
    }
    const account = payload.account
    const status = await delAsync(`${type}:token:${account}`)
    if (status === 0) {
      throw new APIError(`${type}Token:error_token`)
    } else {
      ctx.rest(null)
    }
  }
}

// 检查查询参数或请求body中是否有token
const hasToken = (code = '*:token_error') => {
  return async (ctx, next) => {
    const token = ctx.params.token || ctx.query.token || ctx.request.body.token
    if (typeof token === 'string') {
      ctx.state.token = token
      await next()
    } else {
      throw new APIError(code)
    }
  }
}

module.exports = {
  generateToken,
  checkTokenAuth,
  writeToken,
  deleteToken,
  verifyAccount,
  hasToken
}
