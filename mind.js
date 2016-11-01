'use strict'

require('dotenv').config({ silent: true })

/**
 * Listen for Telegram Input
 */

const TimoblehBot = require('./lib/timobleh-bot')
const Twitter = require('./lib/twitter')
const Database = require('./lib/database')
const makeTweets = require('./make-tweets.js')

const bot = new TimoblehBot({ polling: true })
const db = new Database()

/**
 * Listen for callback_query Event.
 */
bot.on('callback_query', data => {
  db.get(data.data)
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
 * Listen for "/flush <sometext>" command.
 * Will flush the database.
 * Sometext is necessary because the TelegramBot Module needs
 * something to match.
 */
bot.onText(/\/flush (.+)/, msg => {
  db.flush()
    .then(() => {
      bot.sendMessage('Flushed Database. Don\'t send previous tweet, plox.')
    })
    .catch(err => {
      bot.sendMessage(`Error: ${err}`)
    })
})

/**
 * Listen for "/gimme <Integer>" command.
 * Will return provided Number of Tweets.
 */
bot.onText(/\/gimme (.+)/, (msg, match) => {
  let number = +match[1]
  if (!number) {
    bot.sendMessage(`${match[0]} is not a valid number, dumbass.`)
    return
  }

  makeTweets(number)
})
