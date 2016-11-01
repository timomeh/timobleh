'use strict'

const redis = require('redis')
const crypto = require('crypto')

/**
 * Database Wrapper for redis
 */
module.exports = class Database {
  constructor () {
    this.db = redis.createClient(process.env.REDIS_URL)
  }

  /**
   * Adds an array of strings to the database.
   * @param {Array<String>} arr Values to add to database.
   */
  addAll (arr) {
    return new Promise((resolve, reject) => {
      // Create a hash as key for each string
      const keyval = []
      arr.forEach(val => {
        keyval.push(this.createHash(val), val)
      })
      this.db.mset(keyval, (err, replies) => {
        if (err) return reject(err)
        resolve(keyval)
      })
    })
  }

  /**
   * Get a tweet by its hash key.
   * @param {String} key Key of Value.
   */
  get (key) {
    return new Promise((resolve, reject) => {
      this.db.get(key, (err, reply) => {
        if (err) return reject(err)
        resolve(reply)
      })
    })
  }

  /**
   * Hashes a string with sha256.
   * @param {String} str String to hash
   */
  createHash (str) {
    return crypto.createHash('sha256').update(str).digest('hex')
  }

  /**
   * Empty the database.
   */
  flush () {
    return new Promise((resolve, reject) => {
      this.db.flushdb((err, reply) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  /**
   * Closes the databse connection.
   */
  close () {
    this.db.quit()
  }
}
