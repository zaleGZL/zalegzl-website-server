## 概要

博客的服务端是基于 Koa + Mongodb + Restful API + Redis，服务端只提供数据，token验证，所有页面的渲染都是在客户端完成的，并且所有后台接口都是基于 Restful API 规范的，后端返回的数据格式是 JSON，遵循  [Jsend](https://labs.omniti.com/labs/jsend) 规范。redis 用于 token 的缓存。

博客前台项目地址:  [https://github.com/zaleGZL/zalegzl-website](https://github.com/zaleGZL/zalegzl-website)

博客后台管理项目地址: [https://github.com/zaleGZL/zalegzl-website-admin](https://github.com/zaleGZL/zalegzl-website-admin)