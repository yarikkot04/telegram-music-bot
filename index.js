const TelegramBot = require('node-telegram-bot-api')

const TOKEN = '5813243969:AAF59KtcD_vzrj15XIy8OwSenXSHVsFrCxg'


const bot = new TelegramBot(TOKEN, {
    polling : {
        interval : 300,
        autoStart : true,
        params : {
            timeout : 10,
        }
    }
}) 

bot.on('message', (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'I am alive!')
})