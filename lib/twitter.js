'use strict'

const Twttr = require('twitter')

/**
 * Simple Wrapper around Twitter API
 */
module.exports = class Twitter {
  constructor () {
    this.client = new Twttr({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })
  }

  /**
   * Sends a status to twitter.
   */
  tweet (status) {
    return new Promise((resolve, reject) => {
      this.client.post('statuses/update', { status }, (err, tweet, response) => {
        if (err) return reject(err)
        resolve(response)
      })
    })
  }
}
