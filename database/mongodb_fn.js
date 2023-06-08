const { MongoClient } = require('mongodb')
const { isExist } = require('../helper/helper_functions')

const mongoURL = process.env.MONGO_URL

const client = new MongoClient(mongoURL)

const usersChats = client.db().collection('tlg-users')
const topList = client.db().collection('top')

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
            if (history.includes(chosen_song + '|' + songId)) return
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

async function addToTop(title_song, id_song) {
    await client.connect()
    const res = await topList.findOne({ title: 'top' })
    let updatedTopArr = res.top_arr

    let exist_status = isExist(updatedTopArr, id_song)
    if (!exist_status) {
        if (updatedTopArr.length < 50) {
            updatedTopArr.push({ title: title_song, id: id_song, search_req_count: 1 })
            await topList.updateOne(
                { title: 'top' },
                {
                    $set: {
                        top_arr: updatedTopArr,
                    }
                },
            )
        } else {
            updatedTopArr = updatedTopArr.sort((a, b) => a.search_req_count - b.search_req_count).reverse()
            updatedTopArr.pop()
            updatedTopArr.push({ title: title_song, id: id_song, search_req_count: 1 })
            updatedTopArr.reverse()
            await topList.updateOne(
                { title: 'top' },
                {
                    $set: {
                        top_arr: updatedTopArr,
                    }
                },
            )
        }
    } else {
        await topList.updateOne(
            { title: 'top' },
            {
                $set: {
                    top_arr: updatedTopArr,
                }
            },
        )
    }
}


module.exports = {
    addUserToDatabase,
    updateDatabase,
    addToTop,
}