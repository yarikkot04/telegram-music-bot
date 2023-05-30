function askFileFormat(chatId, selectedFile, path, tlg_bot) {
    tlg_bot.sendMessage(chatId, `Choose format: "${path.toString().replace('./', '').replace('.mp', '')}"`, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'mp3',
                    callback_data: `mp3 ${selectedFile}`,
                },
                {
                    text: 'mp4',
                    callback_data: `mp4 ${selectedFile}`,
                },]
            ]
        }
    })
}

module.exports = askFileFormat