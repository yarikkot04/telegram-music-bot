const ytdl = require('ytdl-core')
const fs = require('fs')

function downloadFile(videoId, filePath, chatId, format ,bot) {
    const stream = ytdl(videoId, { quality: 'highestaudio', filter: format, });

    stream.on('error', (error) => {
        const errorMsg = 'Download error. Try again. If the error persists, the file does not meet the conditions for using the bot.'
        bot.sendMessage(chatId, errorMsg)
    });

    stream.on('end', () => {
        if(format == 'videoandaudio'){
            bot.sendVideo(chatId, filePath, { caption: 'Download from: @msc_kott_bot' }).then(() => {
                fs.unlinkSync(filePath)
            }).catch(err => {
                const errorMsg = 'The file size exceeds the maximum allowed for this bot.'
                bot.sendMessage(chatId, errorMsg).then(
                    () => {
                        fs.unlinkSync(filePath)
                    }
                )
            }) 
        } else {
            bot.sendAudio(chatId, filePath, { caption: 'Download from: @msc_kott_bot' }).then(() => {
                fs.unlinkSync(filePath)
            }).catch(err => {
                const errorMsg = 'The file size exceeds the maximum allowed for this bot.'
                bot.sendMessage(chatId, errorMsg).then(
                    () => {
                        fs.unlinkSync(filePath)
                    }
                )
            }) 
        }
  
    });

    stream.pipe(fs.createWriteStream(filePath));
}

module.exports = downloadFile