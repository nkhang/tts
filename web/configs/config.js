var dotenv = require('dotenv')
const jsonConfig = require('./config.json')
let config
dotenv.config()
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV == 'development') {
  config = jsonConfig.development
} else {
  config = jsonConfig   .production
}
console.log(config)

module.exports = config