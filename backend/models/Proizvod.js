const mongoose = require('mongoose')

const proizvodSchema = new mongoose.Schema({
    naziv: {
        type: String,
        minLength: 2,
        required: true,
        unique: true
    },
    kategorija: {
        type: String,
        default: 'Default kategorija'
    },
    isporuke : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Isporuka'
        }
    ]
})

proizvodSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
})

const Proizvod = mongoose.model('Proizvod', proizvodSchema, 'proizvodi')

module.exports = Proizvod;
