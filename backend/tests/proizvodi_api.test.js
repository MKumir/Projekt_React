const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const dohvatiTestPodatke = require('./dohvatTestPodataka')

const api = supertest(app)

const Proizvod = require('../models/Proizvod')
const Korisnik = require('../models/Korisnik')

beforeEach( async () => {
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
    test('Proizvodi se vracaju kao JSON', async () => {
        await api
            .get('/api/proizvodi')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Dohvat svih proizvoda', async () => {
        const proizvodi = await dohvatiTestPodatke.proizvodiIzBaze()
        expect(proizvodi).toHaveLength(3)
    })
    
    test('Naziv drugog proizvoda je Coca-Cola', async () => {
        const proizvodi = await dohvatiTestPodatke.proizvodiIzBaze()
        const drugiProizvod = proizvodi[1]

        expect(drugiProizvod.naziv).toBe('Coca-Cola')
    })

    test('Dohvat specificnog proizvoda', async () => {
        const proizvodiPocetak = await dohvatiTestPodatke.proizvodiIzBaze()
        const trazeniProizvod = proizvodiPocetak[2]
      
        const odgovor = await api
        .get(`/api/proizvodi/${trazeniProizvod.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        console.log(trazeniProizvod)
        console.log(odgovor.body)

        expect(odgovor.body).toEqual(trazeniProizvod)

    })
})

describe('Testovi za POST', () => {
    test('Dodavanje ispravnog proizvoda', async () => {
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

        const noviProizvod = {
            naziv: 'Laptop',
            kategorija: 'Tehnologija'
        }
    
        await api
        .post('/api/proizvodi')
        .set({ authorization: `bearer ${token}`})
        .send(noviProizvod)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
        const proizvodiNaKraju = await dohvatiTestPodatke.proizvodiIzBaze()
        expect(proizvodiNaKraju).toHaveLength(dohvatiTestPodatke.testProizvodi.length + 1)
    
        const nazivi = proizvodiNaKraju.map(p => p.naziv)
        expect(nazivi).toContain('Laptop')

        await Proizvod.deleteOne({naziv: 'Laptop', kategorija: 'Tehnologija'})
    })
    
    test('Dodavanje proizvoda bez naziva', async () => {
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

        const noviProizvod = {
            kategorija: 'TestKategorija'
        }
    
        await api
        .post('/api/proizvodi')
        .set({ authorization: `bearer ${token}`})
        .send(noviProizvod)
        .expect(400)
    
        const proizvodiNaKraju = await dohvatiTestPodatke.proizvodiIzBaze()
        expect(proizvodiNaKraju).toHaveLength(dohvatiTestPodatke.testProizvodi.length)
    })
    
    test('Dodavanje proizvoda s duljinom naziva manjom od 2', async () => {
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

        const noviProizvod = {
            naziv: 'a',
            kategorija: 'abc'
        }
    
        await api
        .post('/api/proizvodi')
        .set({ authorization: `bearer ${token}`})
        .send(noviProizvod)
        .expect(400)
    
        const proizvodi = await dohvatiTestPodatke.proizvodiIzBaze()
        expect(proizvodi).toHaveLength(dohvatiTestPodatke.testProizvodi.length)
    })

    test('Dodavanje proizvoda bez tokena', async () => {
        const noviProizvod = {
            naziv: 'TestNaziv',
            kategorija: 'TestKategorija'
        }
        await api 
        .post('/api/proizvodi')
        .send(noviProizvod)
        .expect(401)
    
        const proizvodiNaKraju = await dohvatiTestPodatke.proizvodiIzBaze()
        expect(proizvodiNaKraju).toHaveLength(dohvatiTestPodatke.testProizvodi.length)
    })

})

describe('Testovi za DELETE', () => {
    test('Ispravno brisanje proizvoda', async () => {

        let p = new Proizvod({naziv: 'TestPr', kategorija: 'TestKat'})
        await p.save()
        
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

        const proizvodiPocetak = await dohvatiTestPodatke.proizvodiIzBaze()
        const proizvodZaBrisanje = proizvodiPocetak[3]
      
        await api
        .delete(`/api/proizvodi/${proizvodZaBrisanje.id}`)
        .set({ authorization: `bearer ${token}`})
        .expect(200)
      
        const proizvodiKraj = await dohvatiTestPodatke.proizvodiIzBaze()
        expect(proizvodiKraj).toHaveLength(proizvodiPocetak.length - 1)
      
        expect(proizvodiKraj).not.toContain(proizvodZaBrisanje)

      })
})


