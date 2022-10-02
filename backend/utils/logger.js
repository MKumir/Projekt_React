const info = (...isporuke) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...isporuke)
    }
}

const greska = (...isporuke) => {
    console.error(...isporuke);
}

module.exports = {info, greska}