const rp = require('request-promise')
const fs = require('fs')
const {promisify} = require('util');
const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");

class SteamAPI {
  constructor(config) {
    this.config = config ? config : require('./config.js')
    this.resultPath = __dirname + "/../results.json"
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
    const writeFile = promisify(fs.writeFile)
    try {
      return writeFile(this.resultPath, stringToSave)
    } catch (e) {
      throw new Error(e)
    }
  }

  async run() {
    try {
      const bFluctuate = await this.isFluctuacte()
      if (bFluctuate) {
        console.log('Prices fluctuates in Steam !! Send Email and save new prices in results file...')
        const content = await this.getGameInfoByIds(this.config.gameIds)
        await this.saveStringInFile(JSON.stringify(content).trim())
        this.sendEmail()
      } else{
        console.log('No change in Steam')
      }
    } catch (e) {
      console.log('ERRRRR!', e)
    }
  }

  async sendEmail() {
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
            rejectUnauthorized: this.config.email.ssl
        }
    }))

    const prevResult = await this._getContentPrevResult()
    const introText = 'New Steams Sales !!!'
    const pricesText = 'Last prices :' + JSON.stringify(prevResult).trim()

    // setup e-mail data with unicode symbols
    const mailOptions = {
        from: `"Steam-watcher" <${this.config.email.user}>`, // sender address
        to: `${this.config.email.recipients}`, // list of receivers
        subject: 'Hello, New Steams Sales ✔', // Subject line
        text: `${introText} ${pricesText}`, // plaintext body
        html: `<b>${introText}</b><br/>${pricesText}` // html body
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
