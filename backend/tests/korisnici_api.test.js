const bcrypt = require('bcrypt')
const Korisnik = require('../models/Korisnik')
const dohvatiTestPodatke = require('./dohvatTestPodataka')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('Testovi KORISNICI - Kada imamo admina i jednog korisnika u bazi', () => {
    beforeEach(async () => {
        await Korisnik.deleteMany({})

        const passHash = await bcrypt.hash('oarwa', 10)
        const korisnik = new Korisnik({
            ime: 'Marko',
            prezime: 'Kumir',
            uloga: 'admin',
            username: 'mkumir1',
            passHash: passHash
        })
        await korisnik.save()

        const passHash2 = await bcrypt.hash('testPass', 10)
        const korisnik2 = new Korisnik({
            ime: 'TestIme',
            prezime: 'TestPrezime',
            uloga: 'radnik',
            username: 'testUser',
            passHash: passHash2
        })

        await korisnik2.save()
    })

    test('Registracija novog korisnika', async () => {
        let token = null
        const logiraniKorisnik = {
            username: 'mkumir1',
            pass: 'oarwa'
        }

        await api
        .post('/api/login')
        .send(logiraniKorisnik)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res.body.token)

        const pocetniKorisnici = await dohvatiTestPodatke.korisniciIzBaze()

        const korisnik = {
            ime: 'Pero',
            prezime: 'Peric',
            uloga: 'poslovoda',
            username: 'pperic',
            pass: 'tajna'
        }

        await api 
        .post('/api/korisnici')
        .set({ authorization: `bearer ${token}`})
        .send(korisnik)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const korisniciKraj = await dohvatiTestPodatke.korisniciIzBaze()
        expect(korisniciKraj).toHaveLength(pocetniKorisnici.length + 1)

        const korImena = korisniciKraj.map(k => k.username)
        expect(korImena).toContain(korisnik.username)
    })

    test('Ispravno brisanje postojeceg korisnika', async () => {
        let token = null
        const logiraniKorisnik = {
            username: 'mkumir1',
            pass: 'oarwa'
        }

        await api
        .post('/api/login')
        .send(logiraniKorisnik)
        .expect('Content-Type', /application\/json/)
        .expect((res) => token = res.body.token)

        const korisniciPocetak = await dohvatiTestPodatke.korisniciIzBaze()
        const korisnikZaBrisanje = korisniciPocetak[1]
      
        await api
        .delete(`/api/korisnici/${korisnikZaBrisanje.id}`)
        .set({ authorization: `bearer ${token}`})
        .expect(200)
      
        const korisniciKraj = await dohvatiTestPodatke.korisniciIzBaze()
        expect(korisniciKraj).toHaveLength(korisniciPocetak.length - 1)
      
        const korisnici = korisniciKraj.map(k => k.username)
        expect(korisnici).not.toContain(korisnikZaBrisanje.username)

    })
  

    afterAll(async () => {
        await mongoose.connection.close()
    })
})
