const proizvodiRouter = require('express').Router()
const Proizvod = require('../models/Proizvod')
const Isporuka = require('../models/Isporuka')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const dohvatiToken = (req) => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        return auth.substring(7)
    }
    return null
}

proizvodiRouter.get('/', async (req, res) => {
    const proizvodi = await Proizvod.find({})
    .populate('isporuke', {kolicina: 1, sektor: 1})
    
    res.json(proizvodi)
})

proizvodiRouter.get('/:id', async (req, res, next) => {
    const proizvod = await Proizvod.findById(req.params.id)
    .populate('isporuke', {kolicina: 1, sektor: 1})
    
    res.json(proizvod)
})

proizvodiRouter.delete('/:id', async (req,res) => {

    console.log("Brisem proizvod")
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id){
        return res.status(401).json({error: 'Neispravni token'})
    }
    console.log('ID KORISNIKA', dekToken.id)


    const rez = await Proizvod
    .findOneAndDelete
    ({
        _id: mongoose.Types.ObjectId(req.params.id)
    })


    console.log(rez)

    if(rez) {
        res.send(rez)
        const rez2 = await Isporuka.deleteMany({ proizvod: mongoose.Types.ObjectId(req.params.id) })
        if(rez2)
        res.send(rez2)
    }
    else
        res.status(404).send({message: "Ne postoji traženi podatak"})
})


proizvodiRouter.post('/', async (req, res, next) => {
    const podatak = req.body
    const token = dohvatiToken(req)

    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id){
        return res.status(401).json({error: "Neispravni token"})
    }

    const proizvod = new Proizvod({
        naziv: podatak.naziv,
        kategorija: podatak.kategorija
    })

    const spremljeniProizvod = await proizvod.save()
    res.json(spremljeniProizvod)
})

proizvodiRouter.put('/:id', async (req, res) => {    
    const podatak = req.body

    console.log('Mijenjam proizvod')
    const token = dohvatiToken(req)
    const dekToken = jwt.verify(token, process.env.SECRET)
    if (!token || !dekToken.id){
        return res.status(401).json({error: "Neispravni token"})
    }

    console.log('ID KORISNIKA', dekToken.id)

    const podaci = {
        naziv: podatak.naziv,
        kategorija: podatak.kategorija
    }

    const proizvod = await Proizvod
    .findOneAndUpdate
    (
    {
        _id: mongoose.Types.ObjectId(req.params.id)
    },
    podaci,
    {new: true}
    )    

    if(proizvod)
        res.json(proizvod)
    else
        res.status(400).send({message: "Neuspjesna promjena proizvoda"})

})

module.exports = proizvodiRouter;
