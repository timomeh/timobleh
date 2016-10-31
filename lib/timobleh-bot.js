const TelegramBot = require('node-telegram-bot-api')

/**
 * Wrapper around Telegram Bot
 */
module.exports = class TimoblehBot {
  constructor ({ polling } = { polling: false }) {
    this.telegram = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling })
  }

  /**
   * Send a simple message
   */
  sendMessage (msg) {
    this.telegram.sendMessage(process.env.CHAT_ID, msg)
  }

  /**
   * Sends a variable amount of tweets.
   */
  sendTweets (tweets) {
    // Create message markup
    // 1) texttexttext
    // 2) texttexttext
    // ...
    let text = tweets.map((tweet, i) => (`<b>${i + 1}\)</b> ${tweet.text}`))

    // Create buttons for tweets
    let buttons =
      tweets.map((tweet, i) => ({ text: i + 1 + '', callback_data: tweet.sha }))

    // Make 5 buttons per row
    let buttonRows = []
    const AMOUNT_PER_ROW = 5
    for (let i = 0; i < buttons.length; i = i + AMOUNT_PER_ROW) {
      buttonRows.push(buttons.slice(i, i + AMOUNT_PER_ROW))
    }

    // Send tweets and buttons to telegram
    this.telegram.sendMessage(process.env.CHAT_ID, text.join('\n\n'), {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: buttonRows
      }
    })
  }
}
