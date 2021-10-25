let calcTip = (total, tipPercent = .25) => total + (total * tipPercent)

let FtoC = temp => (temp - 32) / 1.8

let cToF = temp => (temp * 1.8) + 32

let add = (a, b) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (a < 0 || b < 0) rej('no negatives')
        }, 2000)
        res(a + b)
    })
}

module.exports = {
    calcTip, FtoC, cToF, add
}