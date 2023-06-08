function generateTop10Menu(topList) {
    const menu = []
    let maxDisplayedItems

    if (topList.length - 1 < 10) {
        maxDisplayedItems = topList.length - 1
    } else {
        maxDisplayedItems = 10
    }
    let redactedTitle = ''
    for (let i = 0; i < maxDisplayedItems; i++) {
        redactedTitle = topList[i].title.replace('./', '').replace('.mp3', '').replace('.mp4', '')
        menu.push([{ text: `${i + 1}. ${redactedTitle}`, callback_data: topList[i].id }])
    }
    return menu
}

function generateTopMenu(topList, startPos, endPos, firstPage, lastPage) {
    const menu = []
    let formattedTitle = ''
    for (let i = startPos; i <= endPos; i++) {
        formattedTitle = topList[i].title.replace('./', '').replace('.mp3', '').replace('.mp4', '')
        menu.push([{ text: `${i + 1}. ${formattedTitle}`, callback_data: topList[i].id }])
    }
    if (firstPage) {
        menu.push([{ text: '>>', callback_data: '>> t' }])
    } else if (lastPage) {
        menu.push([{ text: '<<', callback_data: '<< t' }])
    } else {
        menu.push([{ text: '>>', callback_data: '>> t' }, { text: '<<', callback_data: '<< t' }],)
    }
    return menu
}


module.exports = {
    generateTop10Menu,
    generateTopMenu
}