const { APIError } = require('../utils')

// 检查请求的body中是否含有某属性
const hasAttr = (attr, code = '*:others_error', type = 'String') => {
  return async (ctx, next) => {
    if (
      Object.prototype.toString.call(ctx.request.body[attr]) ===
      `[object ${type}]`
    ) {
      await next()
    } else {
      throw new APIError(code)
    }
  }
}

// 检查查询参数中是否含有某个属性 需要判断类型
const hasQsAttr = (attr, code) => {
  return async (ctx, next) => {
    if (ctx.query[attr] !== undefined) {
      await next()
    } else {
      throw new APIError(code)
    }
  }
}

module.exports = {
  hasAttr,
  hasQsAttr
}
