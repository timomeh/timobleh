'use strict'

/**
 * Scheduled task to generate tweets and send it to Telegram
 */

require('dotenv').config({ silent: true })
require('./make-tweets.js')(10)
