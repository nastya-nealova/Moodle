import mongoose from 'mongoose'
export default (uri: string, options : object) => {
  mongoose.connect(uri, options)
  mongoose.Promise = global.Promise
  mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`)
    process.exit(1)
  })
  mongoose.connection.once('open', function () {
    console.log('MongoDB is connected')
  })
  return mongoose.connection
}
