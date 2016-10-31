'use strict'

const Chain = require('markov-chains').default
const entities = new (require('html-entities').AllHtmlEntities)

/**
 * Generate random tweets with markov chain
 */
module.exports = class TweetGenerator {
  constructor (tweets) {
    this.chain = new Chain(tweets, { stateSize: 2 })
  }

  /**
   * Generator for random tweets
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
   * Generate tweets and save into array
   */
  all (amount = 10) {
    const all = []
    for (const tweet of this.generate(amount)) {
      all.push(tweet)
    }

    return all
  }

  /**
   * Make a tweet by joining the markov chain and decode entities
   */
  _makeTweet () {
    return entities.decode(this.chain.walk().join(' '))
  }
}
