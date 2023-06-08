require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const { MongoClient } = require('mongodb')
const searchRequest = require('./search/search_request')
const defineUserChat = require('./chat/define_usr_chat')
const { sendResponseMenu, generateResponseMenu } = require('./chat/chat_menu/response_menu')
const { updateUsrArr, checkChatIndex } = require('./chat/chat_monitoring')
const { splitOne, setFilePath } = require('./helper/helper_functions')
const askFileFormat = require('./chat/chat_menu/format_menu')
const downloadFile = require('./download/download_file')
const { addUserToDatabase, updateDatabase, addToTop } = require('./database/mongodb_fn')
const generateHistoryMenu = require('./chat/chat_menu/history_menu')
const Session = require('./chat/Session')
const { generateTop10Menu, generateTopMenu } = require('./chat/chat_menu/top_menu')

const TOKEN = process.env.TOKEN
const mongoURL = process.env.MONGO_URL

const client = new MongoClient(mongoURL)
const usersChats = client.db().collection('tlg-users')
const topList = client.db().collection('top')

const all_session = []
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
    try {
        const requestResult = await searchRequest(match)
        await addUserToDatabase(id)
        const userChat = defineUserChat(id, requestResult, match)
        sendResponseMenu(id, userChat.get_arr_title(), userChat.get_arr_id(), match, bot)
        updateUsrArr(userChat, all_usr_chat)
    } catch (err) {
        bot.sendMessage(id, 'Sorry, no matches found. Try to describe the name more precisely.')
    }
})

bot.onText(/\/help/, (msg) => {
    const id = msg.chat.id
    const infoAboutCommmand = `
    Information about commands:
    /clear_history - clears the search history
    /history - displays search history
    /top10|50 - returns the top 10|50 most popular songs by search
    /search <name> - search by name
    /help - information about bot commands
    /author - information about the bot author
    `
    bot.sendMessage(id, infoAboutCommmand)
})
bot.onText(/\/author/, (msg) => {
    const id = msg.chat.id
    const infoAboutAuthor = `
    Information:
    gmail: <yarikkotenkoim13@gmail.com>
    telegram: @everain_19
    `
    bot.sendMessage(id, infoAboutAuthor)
})

bot.onText(/\/history/, async (msg) => {
    const id = msg.chat.id
    try {
        await client.connect()
        const selectedСhat = await usersChats.findOne({ chatId: id })
        let history = selectedСhat.history_arr.reverse()
        let max_items_per_page
        if (history.length - 1 < 9) {
            max_items_per_page = history.length - 1
        } else {
            max_items_per_page = 9
        }
        // console.log(history)
        bot.sendMessage(id, 'History menu: ', {
            reply_markup: {
                inline_keyboard: generateHistoryMenu(history, 0, max_items_per_page, false)
            }
        })
    } catch (err) {
        console.log(err)
        bot.sendMessage(id, 'Server error, try again later')
    }
})

bot.onText(/\/clear_history/, async (msg) => {
    const id = msg.chat.id
    await client.connect()
    await usersChats.updateOne(
        { chatId: id },
        {
            $set: {
                history_arr: []
            }
        },
    )
})

bot.onText(/\/top10/, async (msg) => {
    const id = msg.chat.id
    await client.connect()
    const res = await topList.findOne({ title: 'top' })
    let sortedTopArr = res.top_arr.sort((a, b) => a.search_req_count - b.search_req_count).reverse()
    await topList.updateOne(
        { title: 'top' },
        {
            $set: {
                top_arr: sortedTopArr,
            }
        },
    )
    bot.sendMessage(id, 'Top10:', {
        reply_markup: {
            inline_keyboard: generateTop10Menu(sortedTopArr)
        }
    })
})

bot.onText(/\/top50/, async (msg) => {
    const id = msg.chat.id
    const usrSession = new Session(id)
    updateUsrArr(usrSession, all_session)
    await client.connect()
    const res = await topList.findOne({ title: 'top' })
    let sortedTopArr = res.top_arr.sort((a, b) => a.search_req_count - b.search_req_count).reverse()

    let max_items_per_page
    if (sortedTopArr.length - 1 < 9) {
        max_items_per_page = sortedTopArr.length - 1
    } else {
        max_items_per_page = 9
    }

    await topList.updateOne(
        { title: 'top' },
        {
            $set: {
                top_arr: sortedTopArr,
            }
        },
    )
    bot.sendMessage(id, 'Top50:', {
        reply_markup: {
            inline_keyboard: generateTopMenu(sortedTopArr, 0, max_items_per_page, true, false)
        }
    })
})

bot.on('callback_query', async query => {
    const id = query.message.chat.id
    const msg_id = query.message.message_id
    const index = checkChatIndex(id, all_usr_chat)
    const request = splitOne(query.message.text, ' ')[1]
    try {
        if (query.data == '>>') {
            const userReqArr = all_usr_chat[index].get_arr_title()
            if (userReqArr[userReqArr.length - 1].trim() != request.trim()) {
                const requestResult = await searchRequest(request)
                const userChat = defineUserChat(id, requestResult, request.trim())
                updateUsrArr(userChat, all_usr_chat)
            }
            bot.editMessageReplyMarkup({ inline_keyboard: generateResponseMenu(10, 20, all_usr_chat[index].get_arr_title(), all_usr_chat[index].get_arr_id()) }, { chat_id: id, message_id: msg_id })
        } else if (query.data == '<<') {
            const userReqArr = all_usr_chat[index].get_arr_title()
            if (userReqArr[userReqArr.length - 1].trim() != request.trim()) {
                const requestResult = await searchRequest(request)
                const userChat = defineUserChat(id, requestResult, request.trim())
                updateUsrArr(userChat, all_usr_chat)
            }
            bot.editMessageReplyMarkup({ inline_keyboard: generateResponseMenu(0, 10, all_usr_chat[index].get_arr_title(), all_usr_chat[index].get_arr_id()) }, { chat_id: id, message_id: msg_id })
        } else if (splitOne(query.data, ' ')[0] == 'mp3') {
            const selectedFile = splitOne(query.data, ' ')[1]
            const filePath = ('./' + splitOne(query.message.text, ': ')[1] + '.mp3').replaceAll('"', '')
            downloadFile(selectedFile, filePath, id, 'audioonly', bot);
            updateDatabase(id, splitOne(query.message.text, ': ')[1], selectedFile)
            addToTop(filePath, selectedFile)
        } else if (splitOne(query.data, ' ')[0] == 'mp4') {
            const selectedFile = splitOne(query.data, ' ')[1]
            const filePath = ('./' + splitOne(query.message.text, ': ')[1] + '.mp4').replaceAll('"', '')
            downloadFile(selectedFile, filePath, id, 'videoandaudio', bot);
            updateDatabase(id, splitOne(query.message.text, ': ')[1], selectedFile)
            addToTop(filePath, selectedFile)
        } else if (query.data == '<< h') {
            const selectedСhat = await usersChats.findOne({ chatId: id })
            let history = selectedСhat.history_arr.reverse()
            bot.editMessageReplyMarkup({ inline_keyboard: generateHistoryMenu(history, 0, 9, false) }, { chat_id: id, message_id: msg_id })
        } else if (query.data == '>> h') {
            const selectedСhat = await usersChats.findOne({ chatId: id })
            let history = selectedСhat.history_arr.reverse()
            bot.editMessageReplyMarkup({ inline_keyboard: generateHistoryMenu(history, 10, history.length - 2, true) }, { chat_id: id, message_id: msg_id })
        } else if (query.data == '>> t') {
            const index = checkChatIndex(id, all_session)
            const [secondPage, thirdPage, fourthPage, fifthPage] = [2, 3, 4, 5]
            all_session[index].topPagePos++
            const res = await topList.findOne({ title: 'top' })
            let sortedTopArr = res.top_arr.sort((a, b) => a.search_req_count - b.search_req_count).reverse()
            if (all_session[index].topPagePos == secondPage) {
                bot.editMessageReplyMarkup({ inline_keyboard: generateTopMenu(sortedTopArr, 10, 19, false, false) }, { chat_id: id, message_id: msg_id })
            } else if (all_session[index].topPagePos == thirdPage) {
                bot.editMessageReplyMarkup({ inline_keyboard: generateTopMenu(sortedTopArr, 20, 29, false, false) }, { chat_id: id, message_id: msg_id })
            } else if (all_session[index].topPagePos == fourthPage) {
                bot.editMessageReplyMarkup({ inline_keyboard: generateTopMenu(sortedTopArr, 30, 39, false, false) }, { chat_id: id, message_id: msg_id })
            } else if (all_session[index].topPagePos == fifthPage) {
                bot.editMessageReplyMarkup({ inline_keyboard: generateTopMenu(sortedTopArr, 40, 49, false, true) }, { chat_id: id, message_id: msg_id })
            }
        } else if (query.data == '<< t') {
            const index = checkChatIndex(id, all_session)
            const [firstPage, secondPage, thirdPage, fourthPage] = [1, 2, 3, 4]
            all_session[index].topPagePos--
            const res = await topList.findOne({ title: 'top' })
            let sortedTopArr = res.top_arr.sort((a, b) => a.search_req_count - b.search_req_count).reverse()
            if (all_session[index].topPagePos == firstPage) {
                bot.editMessageReplyMarkup({ inline_keyboard: generateTopMenu(sortedTopArr, 0, 9, true, false) }, { chat_id: id, message_id: msg_id })
            } else if (all_session[index].topPagePos == secondPage) {
                bot.editMessageReplyMarkup({ inline_keyboard: generateTopMenu(sortedTopArr, 10, 19, false, false) }, { chat_id: id, message_id: msg_id })
            } else if (all_session[index].topPagePos == thirdPage) {
                bot.editMessageReplyMarkup({ inline_keyboard: generateTopMenu(sortedTopArr, 20, 29, false, false) }, { chat_id: id, message_id: msg_id })
            } else if (all_session[index].topPagePos == fourthPage) {
                bot.editMessageReplyMarkup({ inline_keyboard: generateTopMenu(sortedTopArr, 30, 39, false, false) }, { chat_id: id, message_id: msg_id })
            }
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


