'use strict'

const fs = require('fs')
const TweetGenerator = require('./lib/tweet-generator')
const TimoblehBot = require('./lib/timobleh-bot')
const Database = require('./lib/database')

const tweets = JSON.parse(fs.readFileSync('tweets.json'))
const tweetGenerator = new TweetGenerator(tweets)

/**
 * Generate random tweets,
 * save them for later in the database and
 * send them to TelegramBot.
 * @param  {Number} [amount=10] Amount of Tweets to generate.
 */
module.exports = (amount = 10) => {
  const db = new Database()

  // Generate tweets
  const randomTweets = tweetGenerator.generateSome(amount)

  // Save to database
  db.addAll(randomTweets)
    .then(keyval => {
      // Convert Redis' "key1 value1 key2 value2 ..." into
      // reasonable Array<Object>: [ { key, value }, { key, value }]
      let tweets = []
      for (let i = 0; i < keyval.length; i = i + 2) {
        tweets.push({ sha: keyval[i], text: keyval[i + 1] })
      }

      return tweets
    })
    .then(tweets => {
      // Send tweet drafts to me (through my bot)
      const bot = new TimoblehBot()
      bot.sendTweets(tweets)
    })
    .catch(databaseError => {
      const bot = new TimoblehBot()
      console.error(databaseError)
      bot.sendMessage(`Duh, Database: ${databaseError}`)
    })
    .then(() => { // finally
      db.close()
    })
}
