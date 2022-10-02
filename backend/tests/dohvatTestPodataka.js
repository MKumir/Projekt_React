const Isporuka = require('../models/Isporuka')
const Proizvod = require('../models/Proizvod')
const Korisnik = require('../models/Korisnik')
const mongoose = require('mongoose')

const pocetniProizvodi = {
    pr1_id: '62fd7e2593c09f86b4390280',
    pr2_id: '62fd7e2b93c09f86b4390282',
    pr3_id:'62fd7e3793c09f86b4390284'
}

const pocetneIsporuke = [
    {
        proizvod: mongoose.Types.ObjectId(pocetniProizvodi.pr1_id),
        kolicina: 10,
        sektor: 'A',
        status: true
    },
    {
        proizvod: mongoose.Types.ObjectId(pocetniProizvodi.pr2_id),
        kolicina: 20,
        sektor: 'B',
        status: false
    },
    {
        proizvod: mongoose.Types.ObjectId(pocetniProizvodi.pr3_id),
        kolicina: 4,
        sektor: 'C',
        status: true
    }
]

const testProizvodi = [
    {
        naziv: 'Jabuka',
        kategorija: 'Hrana'
    },
    {
        naziv: 'Coca-Cola',
        kategorija: 'Pice'
    },
    {
        naziv: 'Stol',
        kategorija: 'Namjestaj'
    }
]

const proizvodiIzBaze = async () => {
    const proizvodi = await Proizvod.find({})
    return proizvodi.map(p => p.toJSON())
}

const isporukeIzBaze = async () => {
    const isporuke = await Isporuka.find({})
    .populate('korisnik', { ime: 1, prezime: 1, uloga: 1})
    .populate('proizvod', { naziv: 1, kategorija: 1})

    return isporuke.map(i => i.toJSON())
}

const korisniciIzBaze = async () => {
    const korisnici = await Korisnik.find({})
    .populate('isporuke', {proizvod: 1, kolicina: 1, sektor: 1})

    return korisnici.map(k => k.toJSON())
}

module.exports = {
    pocetneIsporuke, isporukeIzBaze, korisniciIzBaze, proizvodiIzBaze, 
    pocetniProizvodi, testProizvodi
}
