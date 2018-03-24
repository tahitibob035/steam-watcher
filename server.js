const SteamAPI = require('./lib/SteamAPI')
const config = require('./lib/config')
const http = require('http');

try {
    const steamAPI = new SteamAPI(config)
    steamAPI.run()    

    http.createServer(async function (req, res) {
        try {
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.write(await steamAPI._getContentPrevResult())    
        } catch (error) {
            res.writeHead(501, {'Content-Type': 'text/plain; charset=utf-8'})
            console.log(`SERVER ERROR !! ${error.message}`)
            res.write(`SERVER ERROR !!`)
        }
        res.end()
    }).listen(8080)
    
} catch (error) {
    console.log('error:', error)
}

