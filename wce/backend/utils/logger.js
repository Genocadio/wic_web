const info = (...prams) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...prams)
    }
}
const error = (...prams) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...prams)
    }
}
module.exports = {
    info, error
}