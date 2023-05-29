const TelegramBot = require('node-telegram-bot-api')
const searchRequest = require('./search/search_request')
const defineUserChat = require('./chat/define_usr_chat')
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

bot.onText(/\/search (.+)/, async (msg, [source, match]) => {
    const id = msg.chat.id
    const requestResult = await searchRequest(match)
    const userChat = defineUserChat(id, requestResult, match)
    console.log(userChat.get_arr_title())
})