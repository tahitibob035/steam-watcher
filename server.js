const SteamAPI = require('./lib/SteamAPI')
const config = require('./lib/config')
const steamAPI = new SteamAPI(config)
console.log('config:', config)
steamAPI.run()
