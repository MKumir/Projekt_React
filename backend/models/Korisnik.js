const mongoose = require('mongoose')

const korisnikSchema = new mongoose.Schema({
    ime: {
        type: String,
        minLength: 3,
        required: true
    },
    prezime: {
        type: String,
        minLength: 3,
        required: true
    },
    uloga: {
        type: String,
        required: true
    },
    username: {
        type: String,
        minLength: 5,
        required: true,
        unique: true
    },
    passHash: {
        type: String,
        required: true
    },
    isporuke : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Isporuka'
        }
    ]
})

korisnikSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        // Lozinka se ne bi trebala prikazati
        delete ret.passHash
        return ret
    }
})

const Korisnik = mongoose.model('Korisnik', korisnikSchema, 'korisnici')

module.exports = Korisnik
