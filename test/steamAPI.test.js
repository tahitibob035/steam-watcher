const mockedApi = require('./mocks/api');
const config = require('./config.dev.js')
const SteamAPI = require('../lib/SteamAPI')
const steamAPI = new SteamAPI(config)

beforeEach(() => {
  mockedApi.appDetails()
})

describe('steamAPI.getGameInfoById', () => {
  it('should get game infos by id', async () => {
    const gameIds = config.gameIds
    const gameId = gameIds[0]
    const gameInfo = await steamAPI.getGameInfoByIds(gameIds)
    expect(gameInfo).toBeInstanceOf(Object)
    expect(gameInfo).toHaveProperty(gameId + '')
    expect(gameInfo[gameId]).toHaveProperty('data')
    expect(gameInfo[gameId].data).toHaveProperty('price_overview')
    expect(gameInfo[gameId].data.price_overview).toHaveProperty('currency')
    expect(gameInfo[gameId].data.price_overview).toHaveProperty('currency', 'EUR')
    expect(gameInfo[gameId].data.price_overview).toHaveProperty('initial')
    expect(gameInfo[gameId].data.price_overview).toHaveProperty('final')
    expect(gameInfo[gameId].data.price_overview).toHaveProperty('discount_percent')
  })
})

describe('steamAPI.saveStringInFile', () => {
  it('save String in file', async () => {
    const testString = 'Meerkat Power'
    await steamAPI.saveStringInFile(testString)
    const content = await steamAPI._getContentPrevResult()
    expect(typeof content).toBe('string')
    expect(content).toBe(testString)
  })
})

describe('steamAPI._getContentPrevResult', () =>  {
 it('get content result', async () => {
    const content = await steamAPI._getContentPrevResult()
    expect(typeof content).toBe('string')
  })
})

describe('steamAPI.isFluctuacte', () =>  {
  it('return true if prices fluctuate', async () => {
    const steamAPIDifferentsIds = new SteamAPI({ gameIds : [111, 222] })
    steamAPIDifferentsIds.saveStringInFile('meerkat')
    const bFluctuate = await steamAPIDifferentsIds.isFluctuacte()
    expect(bFluctuate).toBeTruthy()
  })

  it('return false if same prices', async () => {
    const steamAPIEquals = new SteamAPI(config)
    steamAPIEquals.saveStringInFile(JSON.stringify(require('./mocks/gamePriceOverview.json')))
    const bFluctuate = await steamAPIEquals.isFluctuacte()
    expect(bFluctuate).toBeFalsy()
  })
})
