const rp = require('request-promise')
const config = require('./config.js')

class SteamAPI {
  constructor() {

  }

  getGameInfoByIds(ids) {
    const idsString = ids.toString()
    const option = {
      uri: `http://store.steampowered.com/api/appdetails?appids=${idsString}&cc=eur&filters=price_overview`,
      json: true
    }
    return rp(option)
  }

  async _getContentPrevResult() {
    const {promisify} = require('util');
    const readFile = promisify(require('fs').readFile)
    try {
      const data = await readFile('./test/mocks/gamePriceOverview.json', 'utf8')
      return Promise.resolve(data)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async isFluctuacte() {
    const gameIds = config.gameIds
    // console.log('!!!!!!!!!!!!!gameIds', gameIds)
    const gameInfo = await this.getGameInfoByIds(gameIds)
    // console.log('!!!!!!!!!!!!!gameInfo', gameInfo)

    return Promise.resolve(false)
  }

}

module.exports = SteamAPI
