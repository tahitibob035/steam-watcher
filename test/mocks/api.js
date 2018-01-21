var nock = require('nock');
appDetails = () => {
  nock('http://store.steampowered.com')
  .get('/api/appdetails?appids=999,346110&cc=eur&filters=price_overview')
  .reply(200, require('./gamePriceOverview.json'));
}

module.exports = {
  appDetails
}
