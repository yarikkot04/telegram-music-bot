const searchRequest = require('../search/search_request')

describe('Checking the size of the response array', () => {
    test('The size must be equal to 20', async () => {
        const result = await searchRequest('begin')
        expect(result.length).toBe(20)
    })
})

describe('Checking that the function returns an array and not undefined', () => {
    test('The function must return an array', async () => {
        const result = await searchRequest('begin')
        expect(result).not.toBeFalsy()
        expect(Array.isArray(result)).toBe(true)
    })
})

describe('Checking that the array returns exactly the elements of the answers, and not undefined', () => {
    test('An array with correct values should be returned', async () => {
        const result = await searchRequest('begin')
        for (let i = 0; i < result.length; i++) {
            expect(result[i]).not.toBeFalsy()
        }
    })
})

describe('Checking that correct answers are returned', () => {
    let completeMatchArr

    beforeEach(() => {
        completeMatchArr = []
    })
    
    test('First song: "Beggin" or "Begin"', async () => {
        const result = await searchRequest('begin')
        for (let i = 0; i < result.length; i++) {
            if(result[i].snippet.title.toLowerCase().includes('begin')) {
                completeMatchArr.push(result[i].snippet.title)
            }
        }
        expect(completeMatchArr.length).toBeGreaterThan(10)
    })
    test('Second song: "House of Memories"', async () => {
        const result = await searchRequest('house of memories')
        for (let i = 0; i < result.length; i++) {
            if(result[i].snippet.title.toLowerCase().includes('house of memories')) {
                completeMatchArr.push(result[i].snippet.title)
            }
        }
        expect(completeMatchArr.length).toBeGreaterThan(10)
    })
    test('Should return an empty array if nothing is found', async () => {
        const result = await searchRequest('dldsdfghj')
        expect(result.length).toBe(0)
    })
})

