'use strict'

const TelegramBot = require('node-telegram-bot-api')

/**
 * Wrapper around Telegram Bot
 */
module.exports = class TimoblehBot {
  constructor ({ polling } = { polling: false }) {
    this.telegram = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling })
    this.receiver = process.env.CHAT_ID
  }

  /**
   * Send a simple message to me.
   * @param {String} msg Message
   */
  sendMessage (msg) {
    this.telegram.sendMessage(this.receiver, msg)
  }

  /**
   * Send tweets to me along some callback buttons.
   * @param {Array<Object>} tweets List of Tweets in form { sha, text }
   */
  sendTweets (tweets) {
    // Create message markup
    // 1) texttexttext
    // 2) texttexttext
    // ...
    let text = tweets.map((tweet, i) =>
      (`<b>${i + 1}\)</b> ${this._encodeEntities(tweet.text)}`))

    // Create callback buttons for tweets
    let buttons =
      tweets.map((tweet, i) => ({ text: i + 1 + '', callback_data: tweet.sha }))

    // Make 5 buttons per row
    let buttonRows = []
    const AMOUNT_PER_ROW = 5
    for (let i = 0; i < buttons.length; i = i + AMOUNT_PER_ROW) {
      buttonRows.push(buttons.slice(i, i + AMOUNT_PER_ROW))
    }

    // Send tweets and buttons to telegram
    this.telegram.sendMessage(this.receiver, text.join('\n\n'), {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: buttonRows
      }
    })
  }

  /**
   * Alias for TelegramBot.on() which checks if message is from me.
   * @param {String} eventType EventType of TelegramBot.on Method
   * @param {Function} cb Callback with signature: data
   */
  on (eventType, cb) {
    return this.telegram.on(eventType, data => {
      if (this._testReceiver(data.from.id)) return

      cb(data)
    })
  }

  /**
   * Alias for TelegramBot.onText() which checks if message is from me.
   * @param {RegExp} regex Regex for TelegramBot.onText Method
   * @param {Function} db Callback with signatur: data, matches
   */
  onText (regex, cb) {
    return this.telegram.onText(regex, (data, match) => {
      if (this._testReceiver(data.from.id)) return

      cb(data, match)
    })
  }

  /**
   * Test if from.id matches my ID.
   * @param {Integer} userId ID to test
   */
  _testReceiver (userId) {
    return userId !== +this.receiver // prepended + converts from string to int
  }

  /**
   * Encode HTML Entities demanded by Telegram.
   * & => &amp;, < => &lt;, > => &gt;, " => &quot;
   * @param {String} text Text to encode.
   * @return {String}  Encoded text.
   */
  _encodeEntities (text) {
    return text
      .replace(/\&/g, '&amp;')
      .replace(/\</g, '&lt;')
      .replace(/\>/g, '&gt;')
      .replace(/\"/g, '&quot;')
  }
}
