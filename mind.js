'use strict'

require('dotenv').config()

/**
 * Listen for Telegram Input
 */

const TimoblehBot = require('./lib/timobleh-bot')
const Twitter = require('./lib/twitter')
const db = require('./lib/database')

const bot = new TimoblehBot({ polling: true })

/**
 * EventListener when I clicked on Tweet Button in Telegram.
 * Send tweet.
 */
bot.telegram.on('callback_query', data => {
  // Only let myself talk to him
  if (data.from.id !== +process.env.CHAT_ID) {
    bot.sendMessage('I\'m not your master.')
    return
  }

  let sha = data.data

  db.get(sha)
    .then(tweet => {
      return (new Twitter()).tweet(tweet)
    })
    .then(response => {
      bot.telegram.answerCallbackQuery(data.id, '', true)
      bot.sendMessage('Tweet sent.')
    })
    .catch(err => {
      bot.telegram.answerCallbackQuery(data.id, '', true)
      bot.sendMessage(`Error: ${err}`)
    })
})

/**
 * EventListener for /flush someText
 */
bot.telegram.onText(/\/flush (.+)/, msg => {
  if (msg.from.id !== +process.env.CHAT_ID) {
    bot.sendMessage('I\'m not your master.')
    return
  }

  db.flush()
    .then(() => {
      bot.sendMessage('Flushed Database. Don\'t send previous tweet, plox.')
    })
    .catch(err => {
      bot.sendMessage(`Error: ${err}`)
    })
})

/**
 * EventListener for /gimme <Number>
 * Returns specified amount of random tweets.
 */
bot.telegram.onText(/\/gimme (.+)/, (msg, match) => {
  if (msg.from.id !== +process.env.CHAT_ID) {
    bot.sendMessage('I\'m not your master.')
    return
  }

  let number = +match[1]
  if (!number) {
    bot.sendMessage(`${match[0]} is not a valid number, dumbass.`)
    return
  }

  require('./src/make-tweets.js')(number, true)
})
