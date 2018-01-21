const mockedApi = require('./mocks/api');
const SteamAPI = require('../lib/SteamAPI')
const config = require('./config.dev.js')
const steamAPI = new SteamAPI()

describe('steamAPI.getGameInfoById', () => {
  beforeEach(() => {
    mockedApi.appDetails()
  })

  it('should get game infos by id', async () => {
    // console.log('config.gameIds', config.gameIds)
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


describe('steamAPI._getContentPrevResult', () =>  {
  beforeEach(() => {
    mockedApi.appDetails()
  })

 it('get content result', async () => {
    const content = await steamAPI._getContentPrevResult()
    expect(typeof content).toBe('string')
  })
})

// describe('steamAPI.isFluctuacte', () =>  {
//   beforeEach(() => {
//     mockedApi.appDetails()
//   })
//
//   it('return true if fluctuation', async () => {
//     const bFluctuate = await steamAPI.isFluctuacte()
//     expect(bFluctuate).toBeTruthy()
//   })
// })
