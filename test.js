const pa = new Promise((resolve, reject) => {
  console.log('a')
  // resolve('yes')
  // reject('no')
  throw new Error('my throw error')
})

const asyncFunc = async () => {
  try {
    const value = await pa
    console.log('this')
  } catch (error) {
    console.log('my catch error')
  }
}

asyncFunc()

// const redis = require('redis')
// const { promisify } = require('util')

// const client = redis.createClient()

// const getAsync = promisify(client.get).bind(client)
// const setAsync = promisify(client.set).bind(client)
// const delAsync = promisify(client.del).bind(client)

// client.on('error', function(err) {
//   console.log('Error ' + err)
// })

// setAsync('key', null).then(value => console.log(value === 'OK'))

// delAsync('key1').then(value => console.log(typeof value))

// getAsync('123ewe').then(value => console.log(value))

// const info = {
//   name: '郭泽凌',
//   age: 21
// }

// const infoString = new Buffer(JSON.stringify(info)).toString('base64')

// console.log(infoString)

// const stringToInfo = new Buffer(infoString, 'base64').toString('utf-8')

// console.log(stringToInfo)

// const jwt = require('jsonwebtoken')

// console.log(
//   jwt.sign(
//     {
//       account: '郭泽凌'
//     },
//     'secret'
//   )
// )

// const token =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvedW50Ijoi6YOt5rO95YeMIiwiaWF0IjoxNTE5MzAwNDMyfQ.BXSVdoeiFjkY-VdUKfrBDqYs1XfpuyHbIEjzq42SCss'

// console.log(jwt.decode(token))

// jwt.verify(token, 'secret', function(err, decoded) {
//   console.log(decoded) // bar
// })

// const fs = require('fs')

// console.log(JSON.parse(fs.readFileSync('./src/privateInfo.json').toString()).secret)

// const path = require('path')

// 文件路径测试
// console.log('process.cwd()', process.cwd())
// console.log('__dirname', __dirname)
// console.log('__filename', __filename)

// console.log(path.dirname(__filename))
