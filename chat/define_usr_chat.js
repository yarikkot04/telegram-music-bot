const Chat = require('./Chat')

function defineUserChat(chatId, userReqResult, query){
    const newChat = new Chat(chatId)
    userReqResult.forEach(value => {
        newChat.push_arr_title(value.snippet.title)
        newChat.push_arr_id(value.id.videoId)
    });
    newChat.push_arr_title(query)
    return newChat
}

module.exports = defineUserChat