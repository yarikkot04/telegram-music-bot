const { MongoClient } = require('mongodb')

const mongoURL = process.env.MONGO_URL

const client = new MongoClient(mongoURL)

const usersChats = client.db().collection('tlg-users')

async function addUserToDatabase(chatId) {
    try {
        await client.connect()
        const status = await checkingForExistence(chatId)
        if (status != true) {
            usersChats.insertOne({ chatId: chatId, history_arr: [] })
        } else {
            console.log('User already exist!')
        }
    } catch (err) {
        console.log(err)
    } 
}


async function checkingForExistence(chatId) {
    try {
        await client.connect()
        const exist = await usersChats.find({
            chatId: chatId
        }).toArray()
        if (exist.length != 0) {
            return true
        }
    } catch (err) {
        console.log(err)
        return false
    } 
    return false
}

async function updateDatabase(chatId, song, songId) {
    try {
        const chosen_song = song.split('"')[1]
        await client.connect()
        const selectedСhat = await usersChats.findOne({ chatId: chatId })
        let history = selectedСhat.history_arr
        if (history.length <= 21) {
            if (history.includes(chosen_song + '|' + songId)) return
            history.push(chosen_song + '|' + songId)
            await usersChats.updateOne(
                { chatId: chatId },
                {
                    $set: {
                        history_arr: history
                    }
                },
            )
        } else {
            history.shift()
            history.push(chosen_song + '|' + songId)
            await usersChats.updateOne(
                { chatId: chatId },
                {
                    $set: {
                        history_arr: history
                    }
                },
            )
        }
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    addUserToDatabase,
    updateDatabase,
}