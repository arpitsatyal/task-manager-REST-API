let { calcTip, celsiusToFahrenheit, fahrenheitToCelsius, add } = require('./../src/math')
const request = require('supertest')

test('calculate total with tip.', () => {
    const total = calcTip(10, .3)
    expect(total).toBe(13)
})

test('should calculate with default param tip', () => {
    const total = calcTip(10)
    expect(total).toBe(12.5)
})

test('Should convert 32 F to 0 C', () => {
    const total = fahrenheitToCelsius(32)
    expect(total).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const total = celsiusToFahrenheit(0)
    expect(total).toBe(32)
})

// for async codes we can use either of the following.
// 1) setting an callback
// 2) using async/await

test('async test demo', done => {
    setTimeout(() => {
        expect(1).toBe(1)
        done()
    },1000)
})

test('should add 2 numbers...', async () => {
    let sum = await add(2, 3)
    expect(sum).toBe(5)
})


