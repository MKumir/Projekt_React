const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const dohvatiTestPodatke = require('./dohvatTestPodataka')

const api = supertest(app)

const Isporuka = require('../models/Isporuka')
const Korisnik = require('../models/Korisnik')

beforeEach( async () => {
    await Isporuka.deleteMany({})
    let i = new Isporuka(dohvatiTestPodatke.pocetneIsporuke[0])
    await i.save()
    i = new Isporuka(dohvatiTestPodatke.pocetneIsporuke[1])
    await i.save()
    i = new Isporuka(dohvatiTestPodatke.pocetneIsporuke[2])
    await i.save()

    await Korisnik.deleteMany({})

    const passHash = await bcrypt.hash('TestPass', 10)
    const korisnik = new Korisnik({
        ime: 'TestIme',
        prezime: 'TestPrezime',
        uloga: 'poslovoda',
        username: 'TestPoslovoda',
        passHash: passHash
    })

    await korisnik.save()

})

describe('Testovi za GET', () => {
    test('Isporuke se vracaju kao JSON', async () => {
        await api
            .get('/api/isporuke')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Dohvat svih isporuka', async () => {
        const isporuke = await dohvatiTestPodatke.isporukeIzBaze()
        expect(isporuke).toHaveLength(3)
    })
    
    test('Naziv proizvoda prve isporuke je Jabuka', async () => {
        const isporuke = await dohvatiTestPodatke.isporukeIzBaze()
        const prvaIsporuka = isporuke[0]

        expect(prvaIsporuka.proizvod['naziv']).toBe('Jabuka')
    })

    test('Dohvat specificne isporuke', async () => {
        const isporukePocetak = await dohvatiTestPodatke.isporukeIzBaze()
        const trazenaIsporuka = isporukePocetak[1]
      
        const odgovor = await api
        .get(`/api/isporuke/${trazenaIsporuka.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const isporuka = await Isporuka.findById(trazenaIsporuka.id)
        .populate('proizvod', { naziv: 1, kategorija: 1})

        const jsonIsporuka = JSON.parse(JSON.stringify(isporuka))
        console.log(jsonIsporuka)
        console.log(odgovor.body)
        expect(odgovor.body).toEqual(jsonIsporuka)

    })
})


describe('Testovi za POST', () => {
    test('Dodavanje ispravne isporuke', async () => {
        let token = null
        const logiraniKorisnik = {
            username: 'TestPoslovoda',
            pass: 'TestPass'
        }

        await api
        .post('/api/login')
        .send(logiraniKorisnik)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res.body.token)

        const novaIsporuka = {
            proizvod: 'Jabuka',
            kolicina: 20,
            sektor: 'D',
            status: true
        }
    
        await api
        .post('/api/isporuke')
        .set({ authorization: `bearer ${token}`})
        .send(novaIsporuka)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
        const isporukeNaKraju = await dohvatiTestPodatke.isporukeIzBaze()
        expect(isporukeNaKraju).toHaveLength(dohvatiTestPodatke.pocetneIsporuke.length + 1)
    
        const kolicine = isporukeNaKraju.map(i => i.kolicina)
        expect(kolicine).toContain(20)
    })
    
    test('Dodavanje isporuke bez naziva proizvoda', async () => {
        let token = null
        const logiraniKorisnik = {
            username: 'TestPoslovoda',
            pass: 'TestPass'
        }

        await api
        .post('/api/login')
        .send(logiraniKorisnik)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res.body.token)

        const novaIsporuka = {
            kolicina: 20,
            sektor: 'D',
            status: true
        }
    
        await api
        .post('/api/isporuke')
        .set({ authorization: `bearer ${token}`})
        .send(novaIsporuka)
        .expect(400)
    
        const isporukeNaKraju = await dohvatiTestPodatke.isporukeIzBaze()
        expect(isporukeNaKraju).toHaveLength(dohvatiTestPodatke.pocetneIsporuke.length)
    })
    
    test('Dodavanje isporuke s neispravnom kolicinom(<= 0)', async () => {
        let token = null
        const logiraniKorisnik = {
            username: 'TestPoslovoda',
            pass: 'TestPass'
        }

        await api
        .post('/api/login')
        .send(logiraniKorisnik)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res.body.token)

        const novaIsporuka = {
            proizvod: 'Coca-Cola',
            kolicina: 0,
            sektor: 'D',
            status: true
        }
    
        await api
        .post('/api/isporuke')
        .set({ authorization: `bearer ${token}`})
        .send(novaIsporuka)
        .expect(400)
    
        const isporuke = await dohvatiTestPodatke.isporukeIzBaze()
        expect(isporuke).toHaveLength(dohvatiTestPodatke.pocetneIsporuke.length)
    })

    test('Dodavanje isporuke bez tokena', async () => {
        const novaIsporuka = {
            proizvod: 'Stol',
            kolicina: 10,
            sektor: 'A',
            status: true
        }
        await api 
        .post('/api/isporuke')
        .send(novaIsporuka)
        .expect(401)
    
        const isporukeNaKraju = await dohvatiTestPodatke.isporukeIzBaze()
        expect(isporukeNaKraju).toHaveLength(dohvatiTestPodatke.pocetneIsporuke.length)
    })
    test('Dodavanje isporuke s proizvodom koji se ne nalazi u Proizvodima', async () => {

        let token = null
        const logiraniKorisnik = {
            username: 'TestPoslovoda',
            pass: 'TestPass'
        }

        await api
        .post('/api/login')
        .send(logiraniKorisnik)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res.body.token)

        const novaIsporuka = {
            proizvod: 'blabla',
            kolicina: 30,
            sektor: 'D',
            status: true
        }
    
        await api
        .post('/api/isporuke')
        .set({ authorization: `bearer ${token}`})
        .send(novaIsporuka)
        .expect(400)
    
        const isporukeNaKraju = await dohvatiTestPodatke.isporukeIzBaze()
        expect(isporukeNaKraju).toHaveLength(dohvatiTestPodatke.pocetneIsporuke.length)
    })
})

describe('Testovi za DELETE', () => {
    test('Ispravno brisanje isporuke', async () => {
        let token = null
        const logiraniKorisnik = {
            username: 'TestPoslovoda',
            pass: 'TestPass'
        }

        await api
        .post('/api/login')
        .send(logiraniKorisnik)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res.body.token)

        console.log(token)

        const isporukePocetak = await dohvatiTestPodatke.isporukeIzBaze()
        const isporukaZaBrisanje = isporukePocetak[0]
      
        await api
          .delete(`/api/isporuke/${isporukaZaBrisanje.id}`)
          .set({ authorization: `bearer ${token}`})
          .expect(204)
      
        const isporukeKraj = await dohvatiTestPodatke.isporukeIzBaze()
        expect(isporukeKraj).toHaveLength(isporukePocetak.length - 1)
      
        const proizvodi = isporukeKraj.map(i => i.proizvod)
        expect(proizvodi).not.toContain(isporukaZaBrisanje.proizvod)
      })
})

describe('Testovi za PUT', () => {
    test('Ispravno modificiranje statusa isporuke', async () => {
        let token = null
        const logiraniKorisnik = {
            username: 'TestPoslovoda',
            pass: 'TestPass'
        }

        await api
        .post('/api/login')
        .send(logiraniKorisnik)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res.body.token)

        const isporukePocetak = await dohvatiTestPodatke.isporukeIzBaze()
        const isporukaZaAzuriranjePocetak = isporukePocetak[0]
        
        const azuriranaIsporuka = {
            proizvod: isporukaZaAzuriranjePocetak.proizvod,
            kolicina: isporukaZaAzuriranjePocetak.kolicina,
            sektor: isporukaZaAzuriranjePocetak.sektor,
            status: !isporukaZaAzuriranjePocetak.status,
        }

        await api
        .put(`/api/isporuke/${isporukaZaAzuriranjePocetak.id}`)
        .set({ authorization: `bearer ${token}`})
        .send(azuriranaIsporuka)
        .expect(200)

        const isporukeKraj = await dohvatiTestPodatke.isporukeIzBaze()
        const isporukaZaAzuriranjeKraj = isporukeKraj[0]
        expect(isporukaZaAzuriranjeKraj.status).toBe(!isporukaZaAzuriranjePocetak.status)
        expect(isporukeKraj).toHaveLength(dohvatiTestPodatke.pocetneIsporuke.length)
    })
})


afterAll(() => {
    mongoose.connection.close()
})
