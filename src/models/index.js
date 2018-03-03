const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/zalegzl')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongodb connection error:'))
db.once('open', function() {
  console.log('mongodb connection success!')
})