const { isObject } = require('../utils')

// 返回Restful API 的响应，自带异常处理
const restify = prefixReg => {
  prefixReg = prefixReg || new RegExp('^(/admin/|/)api/')
  return async (ctx, next) => {
    if (prefixReg.test(ctx.request.path)) {
      // 绑定rest()方法在ctx上
      ctx.rest = data => {
        ctx.response.body = {
          status: 'success',
          data
        }
      }

      try {
        await next()
      } catch (error) {
        console.error(error)
        // 返回错误
        ctx.response.status = 400
        ctx.response.body = {
          status: 'fail',
          data: {
            code:
              isObject(error) && error.errorType === 'APIError'
                ? error.code
                : '*:others_error'
          }
        }
      }
    } else {
      await next()
    }
  }
}

module.exports = {
  restify
}
