const fs = require('fs')
const TweetGenerator = require('../lib/tweet-generator')
const TimoblehBot = require('../lib/timobleh-bot')
const db = require('../lib/database')

const tweets = JSON.parse(fs.readFileSync('tweets.json'))
const tweetGenerator = new TweetGenerator(tweets)

module.exports = function (amount = 10, dontClose = false) {
  // Generate 10 random tweets and add them to the database for later reference
  db.addAll(tweetGenerator.all(amount))
    .then(keyval => {
      // turn key-value-array with tweets from redis into reasonable object
      // { sha, text }
      let tweets = []
      for (let i = 0; i < keyval.length; i = i + 2) {
        tweets.push({ sha: keyval[i], text: keyval[i + 1] })
      }
      if (!dontClose) db.close()

      return tweets
    })
    .catch(databaseError => {
      console.error(databaseError)
      if (!dontClose) db.close()
    })
    .then(tweets => {
      // Send tweets to Telegram Bot
      const bot = new TimoblehBot()
      bot.sendTweets(tweets)
    })
}
