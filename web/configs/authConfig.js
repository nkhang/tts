module.exports = WorkerPath= () => {
    let scheme = 'http'
    let host = global.config.worker.host
    let port = global.config.worker.port
    if (global.config.worker.ssl) {
      scheme = 'https'
    } 
    return `${scheme}://${host}:${port}`
  }
