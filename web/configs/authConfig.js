module.exports = AuthPath = () => {
    let scheme = 'http'
    let host = global.config.auth.host
    let port = global.config.auth.port
    if (global.config.auth.ssl) {
      scheme = 'https'
    } 
    return `${scheme}://${host}:${port}`
  }