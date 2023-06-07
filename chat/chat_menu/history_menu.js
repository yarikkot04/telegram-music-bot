function generateHistoryMenu(historyList, startPos, endPos, lastPage) {
    const menu = []
    const max_items_per_page = 9
    for (let i = startPos; i <= endPos; i++) {
        menu.push([{ text: `${i + 1}. ${historyList[i].split('|')[0]}`, callback_data: historyList[i].split('|')[1] },])
    }
    if (lastPage) {
        menu.push([{ text: '<<', callback_data: '<< h' }])
    } else if (!lastPage && (endPos == max_items_per_page)) {
        menu.push([{ text: '>>', callback_data: '>> h' }])
    }
    return menu
}

module.exports = generateHistoryMenu