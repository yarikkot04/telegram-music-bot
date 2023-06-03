const { updateUsrArr, checkChatIndex } = require('../chat/chat_monitoring')

describe('Function testing: updateUsrArr()', () => {
    let usrArr = []
    beforeEach(() => {
        usrArr = []
        for (let i = 0; i < 3; i++) {
            usrArr.push({ id: `1000${i}`, text: `text #${i}` })
        }
    })
    test('Checking whether a new object will be added if there is no object with this id in the given array', () => {
        expect(usrArr.length).toBe(3)
        updateUsrArr({ id: '10003', text: 'tratata' }, usrArr)
        expect(usrArr[3].id).toBe('10003')
        expect(usrArr.length).toBe(4)
    })
    test('If an element with the specified id already exists, then a new object is not added to the array, but overwritten', () => {
        expect(usrArr.length).toBe(3)
        updateUsrArr({ id: '10001', text: 'overwritten text' }, usrArr)
        expect(usrArr[3]).toBeFalsy()
        expect(usrArr[1].id).toBe('10001')
        expect(usrArr[1].text).toBe('overwritten text')
        expect(usrArr.length).toBe(3)
    })
})

describe('Function testing: checkChatIndex()', () => {
    let usrArr = []
    beforeEach(() => {
        usrArr = []
        for (let i = 0; i < 3; i++) {
            usrArr.push({ id: `1000${i}`, text: `text #${i}` })
        }
    })
    test('Checking whether the function searches for user IDs correctly. If there is a match, it returns the chat index, otherwise ""', () => {
        expect(checkChatIndex('10001', usrArr)).toBe(1)
        expect(checkChatIndex('10000', usrArr)).toBe(0)
        expect(checkChatIndex('10002', usrArr)).toBe(2)
        expect(checkChatIndex('10003', usrArr)).toBe('')
        expect(checkChatIndex('10005', usrArr)).toBe('')
    })
})