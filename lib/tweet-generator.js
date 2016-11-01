'use strict'

const Chain = require('markov-chains').default
const entities = new (require('html-entities').AllHtmlEntities)()

/**
 * Generate random tweets with markov chain
 */
module.exports = class TweetGenerator {
  constructor (tweets) {
    this.chain = new Chain(tweets, { stateSize: 2 })
  }

  /**
   * Iterator for random tweets.
   * @param {Integer} amount Number of Tweets to generate.
   */
  * generate (amount = 10) {
    for (let i = 0, tweet; i < amount; i++) {
      do {
        tweet = this._makeTweet()
      } while (tweet.length > 140)

      yield tweet
    }
  }

  /**
   * Generate tweets as array.
   * @param {Integer} amount Number of Tweets to generate.
   * @return {Array<String>}  Array with random tweets.
   */
  generateSome (amount = 10) {
    const all = []
    for (const tweet of this.generate(amount)) {
      all.push(tweet)
    }

    return all
  }

  /**
   * Make a tweet by joining the markov chain. Also decode html entities
   * for better character count.
   * Note: HTML entities need to be encoded when sending to Telegram.
   * The JSON twitter archive contains encoded entities.
   * @return {String}  Tweet.
   */
  _makeTweet () {
    return entities.decode(this.chain.walk().join(' '))
  }
}
