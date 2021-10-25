let { calcTip, FtoC, cToF, add } = require('../src/math')

test('should calc total w tip', () => {
    let total = calcTip(10, .3)
    expect(total).toBe(13)
})

test('should calc total w default tip', () => {
    let total = calcTip(10)
    expect(total).toBe(12.5)
})

test('should convert 32f to 0c', () => {
    let temp = FtoC(32)
    expect(temp).toBe(0)
})

test('should convert 0c to 32f', () => {
    let temp = cToF(0)
    expect(temp).toBe(32)
})

// test('async test1', done => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)

// })

test('add async testing', async () => {
    let sum = await add(2, 3)
    expect(sum).toBe(5)
})