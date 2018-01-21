const rp = require('request-promise')
const fs = require('fs')
class SteamAPI {
  constructor(config) {
    this.config = config ? config : require('./config.js')
    this.resultPath = __dirname + "/../results"
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
    const readFile = promisify(fs.readFile)
    try {
      const data = await readFile(this.resultPath, 'utf8')
      return Promise.resolve(data)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async isFluctuacte() {
    const gameIds = this.config.gameIds
    const gameInfo = await this.getGameInfoByIds(gameIds)
    try {
      const prevResult = await this._getContentPrevResult()
      return Promise.resolve(JSON.stringify(gameInfo).trim() !== prevResult.trim())
    } catch (e) {
      return Promise.resolve(true)
    }
  }

  async saveStringInFile(stringToSave) {
    const {promisify} = require('util');
    const writeFile = promisify(fs.writeFile)
    try {
      writeFile(this.resultPath, stringToSave)
    } catch (e) {

    }
  }

  async run() {
    try {
      const bFluctuate = await this.isFluctuacte()
      if (bFluctuate) {
        console.log('Prices fluctuates in Steam !! Send Email and save new prices in results file...')
        const content = await this.getGameInfoByIds(this.config.gameIds)
        this.saveStringInFile(JSON.stringify(content).trim())
        this.sendEmail()
      } else{
        console.log('No change in Steam')
      }
    } catch (e) {
      console.log('ERRRRR!', e)
    }
  }

  sendEmail() {
    const nodemailer = require('nodemailer');
    const smtpTransport = require("nodemailer-smtp-transport");

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport(smtpTransport(
      {
        host: this.config.email.host, // hostname
        secure: this.config.email.ssl, // use SSL
        port: this.config.email.port, // port for secure SMTP
        auth: {
            user: this.config.email.user,
            pass: this.config.email.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    }))

    // const transporter = nodemailer.createTransport(
    //   {
    //     host: this.config.email.host, // hostname
    //     secure: this.config.email.ssl, // use SSL
    //     port: this.config.email.port, // port for secure SMTP
    //     auth: {
    //         type: 'OAuth2',
    //         user: this.config.email.user,
    //         accessToken: this.config.email.token
    //     },
    //     tls: {
    //         rejectUnauthorized: false
    //     }
    //   })

    // setup e-mail data with unicode symbols
    const mailOptions = {
        from: `"Steam-watcher" <${this.config.email.user}>`, // sender address
        to: 'tahitibob035@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plaintext body
        html: '<b>Hello world ?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
  }
}

module.exports = SteamAPI
