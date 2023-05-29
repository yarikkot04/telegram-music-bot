function sendResponseMenu(chatId, title_arr, id_arr, requestMsg, tlg_bot) {
    let menu = []
    menu = generateResponseMenu(0, 10, title_arr, id_arr)
    tlg_bot.sendMessage(chatId, `Result: ${requestMsg}`, {
        reply_markup: {
            inline_keyboard: menu
        }
    })
    menu = []
}


function generateResponseMenu(start_pos, end_pos, title_arr, id_arr) {
    const pageArr = []
    console.log('title',title_arr)
    for (let i = start_pos; i < end_pos; i++) {
        pageArr.push([{ text: `${i + 1}. ${title_arr[i].toString()}`, callback_data: `${id_arr[i]}` }])
    }
    if (end_pos <= 10) {
        pageArr.push([{ text: '>>', callback_data: '>>' }])
    } else {
        pageArr.push([{ text: '<<', callback_data: '<<' }])
    }
    return pageArr
}

module.exports = {
    sendResponseMenu,
    generateResponseMenu
}