const isDev = process.env.NODE_ENV !== 'production'
const isJest = process.env.JEST_WORKER_ID !== undefined
if (typeof document !== 'undefined' && !isJest) {
  throw new Error('Do not import config.js from inside the client-side code.')
}
const prodConfig = {
  siteName: 'Moodle',
  baseUrl: 'http://localhost:3000',
  dev: isDev,
  jwtSecret: 'ubfaWS62u9LXbBVXaCfG263zecqcm692npKdsKG98cpubxfqR6vFJhf3qUbdaj8z',
  locale: { default: 'en', supported: ['en', 'en_US', 'uk_UA'] },
  mongo: {
    uri: 'mongodb://localhost:27017/Moodle',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10, // Maintain up to 10 socket connections
      bufferMaxEntries: 0
    }
  }
}
module.exports = prodConfig
