const isporukeRouter = require('express').Router()
const Isporuka = require('../models/Isporuka')
const Korisnik = require('../models/Korisnik')
const Proizvod = require('../models/Proizvod')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const dohvatiToken = (req) => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        return auth.substring(7)
    }
    return null
}

isporukeRouter.get('/', async (req, res) => {
    const isporuke = await Isporuka.find({})
    .populate('korisnik', { ime: 1, prezime: 1, uloga: 1})
    .populate('proizvod', { naziv: 1, kategorija: 1})

    res.json(isporuke)
})

isporukeRouter.get('/:id', async (req, res, next) => {
    const isporuka = await Isporuka.findById(req.params.id)
    .populate('korisnik', { ime: 1, prezime: 1, uloga: 1})
    .populate('proizvod', { naziv: 1, kategorija: 1})
    

    res.json(isporuka)
})

isporukeRouter.delete('/:id', async (req,res) => {

    console.log("Brisem isporuku")
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id){
        return res.status(401).json({error: 'Neispravni token'})
    }
    console.log('ID KORISNIKA', dekToken.id)


    const rez = await Isporuka
    .findOneAndDelete
    ({
        _id: mongoose.Types.ObjectId(req.params.id)
    })
    
    console.log(rez)
    if(rez)
        res.status(204).end()
    
    else{
        res.status(404).send({message: "Ne postoji trazena isporuka za brisanje"})
    }
    
})

isporukeRouter.post('/', async (req, res, next) => {
    const podatak = req.body
    const token = dohvatiToken(req)


    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id){
        return res.status(401).json({error: "Neispravni token"})
    }


    const korisnik = await Korisnik.findById(dekToken.id)
    const proizvod = await Proizvod.findOne({naziv: podatak.proizvod})
    
    const isporuka = new Isporuka({
        proizvod: proizvod._id,
        kolicina: podatak.kolicina,
        sektor: podatak.sektor,
        datum: new Date(),
        status: podatak.status || false,
        korisnik: korisnik._id
    })

    const spremljenaIsporuka = await isporuka.save()
    korisnik.isporuke = korisnik.isporuke.concat(spremljenaIsporuka._id)
    proizvod.isporuke = proizvod.isporuke.concat(spremljenaIsporuka._id)
    await korisnik.save()
    await proizvod.save()

    if(spremljenaIsporuka)
        res.json(spremljenaIsporuka)
    else
        res.status(400).send({message: "Neispravan unos"})
})

isporukeRouter.put('/:id', async (req, res) => {    
    const podatak = req.body

    console.log('Mijenjam isporuku')
    const token = dohvatiToken(req)

    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id){
        return res.status(401).json({error: "Neispravni token"})
    }

    console.log('ID KORISNIKA', dekToken.id)


    const podaci = {
        kolicina: podatak.kolicina,
        sektor: podatak.sektor,
        status: podatak.status,
    }


    const isporuka = await Isporuka
    .findOneAndUpdate
    (
    {
        _id: mongoose.Types.ObjectId(req.params.id),
        proizvod: mongoose.Types.ObjectId(podatak.proizvod['id']),
    },
    podaci,
    {new: true}
    )    


    if(isporuka)
        res.json(isporuka)
    else
        res.status(400).send({message: "Neuspjesna promjena isporuke"})

})

module.exports = isporukeRouter

