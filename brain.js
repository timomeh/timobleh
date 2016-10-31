'use strict'

/**
 * Scheduled task to generate tweets and send it to Telegram
 */

require('dotenv').config()
require('./src/make-tweets.js')()
