require('dotenv').config();
const { google } = require('googleapis')
const yt_api_key = process.env.YT_API_KEY

const youtube = google.youtube({
    version: 'v3',
    auth: yt_api_key,
})

async function searchRequest(query) {
 
    const request = await youtube.search.list({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 20,
    })

    const result = request.data.items

    return result
}

module.exports = searchRequest