const TelegramBot = require('node-telegram-bot-api')
const searchRequest = require('./search/search_request')
const defineUserChat = require('./chat/define_usr_chat')
const { sendResponseMenu, generateResponseMenu } = require('./chat/chat_menu/response_menu')
const { updateUsrArr } = require('./chat/chat_monitoring')
const TOKEN = '5813243969:AAF59KtcD_vzrj15XIy8OwSenXSHVsFrCxg'

const all_usr_chat = []

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10,
        }
    }
})

bot.onText(/\/search (.+)/, async (msg, [source, match]) => {
    const id = msg.chat.id
    const requestResult = await searchRequest(match)
    const userChat = defineUserChat(id, requestResult, match)
    sendResponseMenu(id, userChat.get_arr_title(), userChat, match, bot)
    updateUsrArr(userChat, all_usr_chat)
    console.log(all_usr_chat)
})

bot.on('callback_query', query => {
    const id = query.message.chat.id
    const msg_id = query.message.message_id
    console.log(id)
    console.log(msg_id)
})