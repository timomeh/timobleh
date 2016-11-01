# timobleh

> Brain of Twitter Bot [@timobleh](https://twitter.com/timobleh) with connection through [Telegram](https://telegram.org/).

This Twitter Bot uses 7.984 Tweets (Oct 2012 - Oct 2016) from my Twitter Account *[@timomeh](https://twitter.com/timobleh)* to generate new masterpieces. So basically, it's just another *\_ebooks* Bot. It generates tweets with a [markov chain](http://www.google.com/search?q=markov+chain).

*»Machine assembled poetry.«*

## But…

I don't want it to spit out a nonsense tweet every few minutes. So before it tweets something, it sends me a few randomly generated tweets to my Telegram Account. I can *approve* a tweet directly in Telegram, which then will be tweeted by the bot. I can't change a tweet in this approval process, it stays truly random (stochastic).

<p align="center">
  <img alt="Tweets" src="https://raw.githubusercontent.com/timomeh/timobleh/master/.github/tweets.png" width="700">
</p>

## Fork it

It shouldn't be hard to set this up for yourself.

### Setup

1. Create a Twitter Account and create an app for your Twitter Account in Twitter's Development Console. Hardest part is to verify your bot, because you have to verify it with a phone number.
2. Create a Telegram Account, if you don't have one.
3. Create a Telegram Bot using [@BotFather](https://core.telegram.org/bots).
4. Download your Twitter Archive, which contains `tweets.csv`, a list of all your old tweets.
5. Convert this csv to a better format using the provided `node scripts/archive_to_json.js`. You can adjust this script however you want, it just needs to output `Array<Array<String>>`.
6. Deploy it to Heroku.
7. Set the [Environment Variables](#environment-variables).
8. Add Heroku Redis.
9. Add Heroku Scheduler and set the times, where the bot should send you random tweets. Command is `node brain.js`.

### Environment Variables

- `TELEGRAM_BOT_TOKEN` The Token of your Telegram Bot which @BotFather told you.
- `CHAT_ID` Your Telegram Chat ID (It's your numeric UserID).
- `TWITTER_CONSUMER_KEY` Consumer Key of your Twitter App.
- `TWITTER_CONSUMER_SECRET` Consumer Secret of your Twitter App.
- `TWITTER_ACCESS_TOKEN` Access Token for your Twitter App.
- `TWITTER_ACCESS_TOKEN_SECRET` Access Token Secret for your Twitter App.

### Scripts

`node brain.js` will generate 10 tweets and send it to you.

`node mind.js` will listen for Telegram Activity and respond to your requests. It's a background activity.

`node scripts/archive_to_json.js` converts the Twitter archive into a suitable tweets.json.

### Bot Commands

`/flush yeah` will empty the database, so it isn't full of crap.

`/gimme 10` will send you 10 random tweets.
