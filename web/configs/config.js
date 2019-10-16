var dotenv = require('dotenv')
const jsonConfig = require('./config.json')
let config
dotenv.config()
let env = process.env.NODE_ENV
if (env == 'production') {
  config = jsonConfig.production
} else {
  config = jsonConfig.development
}
global.config = config 

module.exports = config