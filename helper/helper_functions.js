function splitOne(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
        return [str.slice(0, index), str.slice(index + delimiter.length)];
    }
    return [str];
}

function setFilePath(menu, songCode) {
    for (let i = 0; i < menu.length; i++) {
        if (menu[i][0].callback_data == songCode) {
            return menu[i][0].text.replace(' ', '|').split('|')[1].replaceAll('/', '')
        }
    }
}

module.exports = {
    splitOne,
    setFilePath,
}