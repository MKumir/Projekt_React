require('dotenv').config()

const PORT = process.env.PORT

// Podatci za spajanje na bazu
const user = process.env.ATLAS_USER
const password = process.env.ATLAS_PASS
const dbname = process.env.NODE_ENV === 'test'
? 'isporuke-api-test'
: 'isporuke-api'

const DB_URI = `mongodb+srv://${user}:${password}@cluster0.xbqgsl2.mongodb.net/${dbname}?retryWrites=true&w=majority`

module.exports = {PORT, DB_URI}