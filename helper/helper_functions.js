function splitOne(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
        return [str.slice(0, index), str.slice(index + delimiter.length)];
    }
    return [str];
}

module.exports = {
    splitOne,
}