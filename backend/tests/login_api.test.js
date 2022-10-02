const bcrypt = require('bcrypt')
const Korisnik = require('../models/Korisnik')
const dohvatiTestPodatke = require('./dohvatTestPodataka')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('Testovi LOGIN', () => {
    beforeEach(async () => {
        await Korisnik.deleteMany({})

        const passHash = await bcrypt.hash('test123', 10)
        const korisnik = new Korisnik({
            ime: 'TestIme',
            prezime: 'TestPrezime',
            uloga: 'radnik',
            username: 'testUser',
            passHash: passHash
        })
        await korisnik.save()
    })

    test('Prijava postojeceg korisnika s ispravnim password-om', async () => {
        const podatak = {
            username: 'testUser',
            pass: 'test123'
        }
        let username = null

        await api
        .post('/api/login/')
        .send(podatak)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect((res) => username = res.body.username)

        expect(username).toBe('testUser')
    }) 

    test('Prijava postojeceg korisnika s neispravnim password-om', async () => {
        const podatak = {
            username: 'testUser',
            pass: 'test12'
        }
        let username = null

        await api
        .post('/api/login/')
        .send(podatak)
        .expect(401)
        .expect('Content-Type', /application\/json/)
        .expect((res) => username = res.body.username)

        expect(username).toBe(undefined)
    })

    test('Neuspjesna prijava nepostojeceg korisnika', async () => {

        const podatak = {
            username: 'blabla',
            pass: 'abc'
        }
        let username = null

        await api
        .post('/api/login/')
        .send(podatak)
        .expect(401)
        .expect('Content-Type', /application\/json/)
        .expect((res) => username = res.body.username)

        expect(username).toBe(undefined)
    })

})