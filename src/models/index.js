const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const info = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../privateInfo.json')).toString()
)

const account = info.adminAccount
const pwd = info.adminPassword

mongoose.connect(
  `mongodb://${account}:${pwd}@119.29.145.190:27017/zalegzl?authSource=admin`
)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongodb connection error:'))
db.once('open', function() {
  console.log('mongodb connection success!')
})
