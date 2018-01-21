const SteamAPI = require('./lib/SteamAPI')
const config = require('./lib/config')
const steamAPI = new SteamAPI(config)

steamAPI.run()
