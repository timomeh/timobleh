'use strict'

/**
 * Utility for creating twitter archive (csv) into a markov-chain suitable JSON.
 * For manual use.
 */

const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')

const writeStream = fs.createWriteStream(path.resolve('..', 'tweets.json'))

writeStream.write('[\n')

let first = true

fs.createReadStream('tweets.csv')
  .pipe(csv())
  .on('data', data => {
    // Skip tweets before 2012-10-01
    if (new Date(data.timestamp) < new Date('2012-10-01 00:00:00 +0000')) return

    let words = data.text
      .split(/[\s\n]+/)
      .filter(word => (word.length > 0)) // Filter empty words
      .filter(word => (word[0] !== '@')) // Filter @mentions
      .filter(word => (word !== 'RT')) // Filter phrase "RT"
      .filter(word => (!/https?:\/\//.test(word))) // Filter URLs

    if (words.length > 0) {
      writeStream.write(`${first ? '' : ',\n'}${JSON.stringify(words)}`)
    }

    first = false
  })
  .on('end', () => {
    writeStream.write(']')
    writeStream.end()
  })
