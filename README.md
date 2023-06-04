# Telegram Music Bot
 > For security purposes, I wrote the key to the Telegram bot in the Design document. Before you begin, replace the key in the .env file with the one in Design document.

## Description

"telegram-music-bot" is a telegram bot for downloading songs in two formats: mp3, mp4. The user, depending on his wishes, can download audio or video. This bot uses the "googleapis" library to search for music via "YouTube". It uses the "ytdl-core" library to download files. It also has additional functionality. The user can view the history of his searches, as well as see the songs that are most often searched for with the help of this bot.

## Installation
1. To use the program, you need to download Node.js, npm.

[Node.js](https://nodejs.org/en/download/)

[npm](https://www.npmjs.com/package/download)

2. And also upload the modules used in the project

```
$ npm install 
```

3. To start the bot, you need to enter the command:

```
$ npm run dev
```

4. To run the tests, you need to enter the command:

```
$ npm run test
```
