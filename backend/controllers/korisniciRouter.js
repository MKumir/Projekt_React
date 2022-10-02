const korisniciRouter = require('express').Router()
const Korisnik = require('../models/Korisnik')
const Isporuka = require('../models/Isporuka')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const dohvatiToken = (req) => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        return auth.substring(7)
    }
    return null
}

korisniciRouter.get('/', async (req, res) => {
    const korisnici = await Korisnik.find({})
    .populate('isporuke', {proizvod: 1, kolicina: 1, sektor: 1}) //inner join

    res.json(korisnici)
})

korisniciRouter.get('/:id', async (req, res, next) => {
    const korisnik = await Korisnik.findById(req.params.id)
    .populate('isporuke', {proizvod: 1, kolicina: 1, sektor: 1})
    
    res.json(korisnik)
})

korisniciRouter.delete('/:id', async (req,res) => {

    console.log("Brisem korisnika")
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id){
        return res.status(401).json({error: 'Neispravni token'})
    }
    console.log('ID KORISNIKA', dekToken.id)


    const rez = await Korisnik
    .findOneAndDelete
    ({
        _id: mongoose.Types.ObjectId(req.params.id)
    })


    console.log(rez)

    if(rez) {
        res.send(rez)
        const rez2 = await Isporuka.deleteMany({ korisnik: mongoose.Types.ObjectId(req.params.id) })
        if(rez2)
        res.send(rez2)
       
    }
    else
        res.status(404).send({message: "Ne postoji traženi podatak"})
})


korisniciRouter.post('/', async (req, res) => {

    const sadrzaj = req.body

    const token = dohvatiToken(req)
 
    const dekToken = jwt.verify(token, process.env.SECRET)
    
    if (!token || !dekToken.id){
        return res.status(401).json({error: "Neispravni token"})
    }

    const runde = 10
    const passHash = sadrzaj.pass.length >= 5
    ?  await bcrypt.hash(sadrzaj.pass, runde)
    :  null
   

    const korisnik = new Korisnik({
        ime: sadrzaj.ime,
        prezime: sadrzaj.prezime,
        uloga: sadrzaj.uloga,
        username: sadrzaj.username,
        passHash: passHash
    })

    const sprKorisnik = await korisnik.save()
    res.json(sprKorisnik)
})


korisniciRouter.put('/:id', async (req, res) => {    
    const podatak = req.body

    console.log('Mijenjam korisnika')
    const token = dohvatiToken(req)

    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id){
        return res.status(401).json({error: "Neispravni token"})
    }

    console.log('ID KORISNIKA', dekToken.id)

    const runde = 10
    const passHash = await bcrypt.hash(podatak.pass, runde)

    const podaci = {
        ime: podatak.ime,
        prezime: podatak.prezime,
        uloga: podatak.uloga,
        username: podatak.username,
        passHash: passHash
    }

    const korisnik = await Korisnik
    .findOneAndUpdate
    (
    {
        _id: mongoose.Types.ObjectId(req.params.id)
    },
    podaci,
    {new: true}
    )    

    if(korisnik)
        res.json(korisnik)
    else
        res.status(400).send({message: "Neuspjesna promjena korisnika"})

})





module.exports = korisniciRouter
