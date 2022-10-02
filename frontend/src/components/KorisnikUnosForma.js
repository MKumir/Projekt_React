import React, {useState, useEffect} from "react";
import korisniciAkcije from "../services/korisnici";
import korisnikAkcije from '../services/korisnici'

const KorisnikUnosForma = (props) => {
    const [korisnici, postaviKorisnike] = useState([])
    const [unosIme, postaviUnosIme] = useState("")
    const [unosPrezime, postaviUnosPrezime] = useState("")
    const [unosUloga, postaviUnosUloga] = useState("radnik")
    const [unosUsername, postaviUnosUsername] = useState("")
    const [unosPass, postaviUnosPass] = useState("")

    const promjenaUnosaIme = (e) => {
        postaviUnosIme(e.target.value)
    }
    const promjenaUnosaPrezime = (e) => {
        postaviUnosPrezime(e.target.value)
    }
    const promjenaUnosaUloga = (e) =>{
        postaviUnosUloga(e.target.value)
    }
    const promjenaUnosaUsername = (e) =>{
        postaviUnosUsername(e.target.value)
    }
    const promjenaUnosaPass = (e) =>{
        postaviUnosPass(e.target.value)
    }


    const noviKorisnik = (e) =>{
        e.preventDefault()
        const noviObjekt = {
            ime: unosIme,
            prezime: unosPrezime,
            uloga: unosUloga,
            username: unosUsername,
            pass: unosPass
        }
        korisnikAkcije.stvori(noviObjekt).then(res => {
            console.log(res.data)
        postaviKorisnike(korisnici.concat(res.data))
        })
        
        postaviUnosIme('')
        postaviUnosPrezime('')
        postaviUnosUloga('Radnik')
        postaviUnosUsername('')
        postaviUnosPass('')
        if(!(unosIme.length < 3 || unosPrezime.length < 3 || unosUsername.length < 5 || unosPass.length < 5)){
            window.location.reload(null)
        } else {
            alert('Neispravan unos')
        }
    }

    useEffect( () => {
        korisniciAkcije.dohvatiSve().then(res => {
            console.log(res.data)
            postaviKorisnike(res.data)})
    }, [])

    return (
    <div>
        <h2>Registriraj korisnika:</h2>
        <form onSubmit={noviKorisnik}>
            <div>Ime: 
                <input 
                    placeholder="Unesi ime..." 
                    value={unosIme}  
                    onChange={promjenaUnosaIme}
                />
            </div>
            <div>Prezime: 
                <input 
                    placeholder="Unesi prezime..." 
                    value={unosPrezime}  
                    onChange={promjenaUnosaPrezime}
                />
            </div>
            <div>Uloga: 
                <select value={unosUloga} onChange={promjenaUnosaUloga}>
                    <option value="radnik">radnik</option>
                    <option value="poslovoda">poslovoda</option>
                </select>
            </div>
            <div>Username: 
                <input 
                    placeholder="Unesi username..." 
                    value={unosUsername}  
                    onChange={promjenaUnosaUsername}
                />
            </div>
            <div>Pass: 
                <input 
                    placeholder="Unesi lozinku..." 
                    value={unosPass}  
                    onChange={promjenaUnosaPass}
                />
            </div>
            <button style={{marginTop: 20}} type="submit">Registriraj</button>
        </form>
      </div>
    )
}

export default KorisnikUnosForma;
