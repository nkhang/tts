var dotenv = require('dotenv')
const jsonConfig = require('./config.json')
let config
dotenv.config()
let env = process.env.NODE_ENV
if (env == 'production') {
    console.log('Running under production configuration')
    config = jsonConfig.production
} else {
    console.log('Running under development configuration')
    config = jsonConfig.development
}
global.config = config 

module.exports = config
