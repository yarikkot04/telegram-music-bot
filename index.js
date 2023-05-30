const TelegramBot = require('node-telegram-bot-api')
const searchRequest = require('./search/search_request')
const defineUserChat = require('./chat/define_usr_chat')
const { sendResponseMenu, generateResponseMenu } = require('./chat/chat_menu/response_menu')
const { updateUsrArr, checkChatIndex } = require('./chat/chat_monitoring')
const { splitOne ,setFilePath } = require('./helper/helper_functions')
const askFileFormat = require('./chat/chat_menu/format_menu')
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
    sendResponseMenu(id, userChat.get_arr_title(), userChat.get_arr_id(), match, bot)
    updateUsrArr(userChat, all_usr_chat)
})

bot.on('callback_query', async query => {
    const id = query.message.chat.id
    const msg_id = query.message.message_id
    const index = checkChatIndex(id, all_usr_chat)
    const request = splitOne(query.message.text, ' ')[1]
    try{
        let userReqArr = all_usr_chat[index].get_arr_title()
        if (query.data == '>>') {
            if(userReqArr[userReqArr.length - 1].trim() != request.trim()){
                const requestResult = await searchRequest(request)
                const userChat = defineUserChat(id, requestResult, request.trim())
                updateUsrArr(userChat, all_usr_chat)
            }
            bot.editMessageReplyMarkup({ inline_keyboard: generateResponseMenu(10, 20, all_usr_chat[index].get_arr_title(), all_usr_chat[index].get_arr_id()) }, { chat_id: id, message_id: msg_id })
        } else if (query.data == '<<') {
            if(userReqArr[userReqArr.length - 1].trim() != request.trim()){
                const requestResult = await searchRequest(request)
                const userChat = defineUserChat(id, requestResult, request.trim())
                updateUsrArr(userChat, all_usr_chat)
            }
            bot.editMessageReplyMarkup({ inline_keyboard: generateResponseMenu(0, 10, all_usr_chat[index].get_arr_title(), all_usr_chat[index].get_arr_id()) }, { chat_id: id, message_id: msg_id })
        } else if (splitOne(query.data, ' ')[0] == 'mp3') {
            const selectedFile = splitOne(query.data, ' ')[1]
            const filePath = ('./' + splitOne(query.message.text,': ')[1] + '.mp3').replaceAll('"','')
            console.log(selectedFile)
            console.log(filePath)

        } else if (splitOne(query.data, ' ')[0] == 'mp4') {
            const selectedFile = splitOne(query.data, ' ')[1]
            const filePath = ('./' + splitOne(query.message.text,': ')[1] + '.mp4').replaceAll('"','')
            console.log(selectedFile)
            console.log(filePath)
        } else {
            const respondList = query.message.reply_markup.inline_keyboard
            const selectedFileId = query.data
            let filePath = `./${setFilePath(respondList, selectedFileId)}.mp`;
            askFileFormat(id, selectedFileId, filePath, bot)
        }
    } catch (err) {
        all_usr_chat[index] = []
        console.log(err)
        bot.sendMessage(id, 'Server error, please try again;)')
    }
})


