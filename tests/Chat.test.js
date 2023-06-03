const Chat = require('../chat/Chat')

describe('Checking whether a new object is being created', () => {
    test('A new chat object should appear', () => {
        const newChat = new Chat('010001')
        expect(typeof newChat).toBe('object')
        expect(newChat.id).toBe('010001')
    })
})

describe('Checking the operation of object methods', () => {
    let newChat
    beforeEach(() => {
        newChat = new Chat()
    })
    test('Methods: push_arr_title(), get_arr_title()', () => {
        newChat.push_arr_title('test elem #1')
        newChat.push_arr_title('test elem #2')
        newChat.push_arr_title('test elem #3')

        expect(typeof newChat.get_arr_title()).toBe('object')
        expect(newChat.get_arr_title().length).toBe(3)
        expect(newChat.get_arr_title()[0]).toBe('test elem #1')
        expect(newChat.get_arr_title()[1]).toBe('test elem #2')
        expect(newChat.get_arr_title()[2]).toBe('test elem #3')
    })
    test('Methods: push_arr_id(), get_arr_id()', () => {
        newChat.push_arr_id('test key #1')
        newChat.push_arr_id('test key #2')
        newChat.push_arr_id('test key #3')

        expect(typeof newChat.get_arr_id()).toBe('object')
        expect(newChat.get_arr_id().length).toBe(3)
        expect(newChat.get_arr_id()[0]).toBe('test key #1')
        expect(newChat.get_arr_id()[1]).toBe('test key #2')
        expect(newChat.get_arr_id()[2]).toBe('test key #3')
    })
})
