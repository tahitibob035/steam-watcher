const gameIds = process.env.IDS ? process.env.IDS.split(',') : [346110]
const ssl = process.env.SMTP_SECURE ==! undefined ? process.env.SMTP_SECURE : false
const config = {
  gameIds : gameIds,
  email : {
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT || '465',
    ssl: ssl,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    recipients: process.env.RECIPIENTS || ''
  }
}
module.exports = config
