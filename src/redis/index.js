const redis = require('redis')
const { promisify } = require('util')

const client = redis.createClient()

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)
const delAsync = promisify(client.del).bind(client)

client.on('error', function(err) {
  console.log('Error ' + err)
})

client.on('connect', function() {
  console.log('redis connection success!')
})

module.exports = {
  client,
  getAsync,
  setAsync,
  delAsync
}
