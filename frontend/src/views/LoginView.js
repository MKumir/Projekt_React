import React, {useState, useEffect} from "react";
import LoginForma from "../components/LoginForma";
import isporukeAkcije from '../services/isporuke'
import proizvodiAkcije from '../services/proizvodi'
import korisniciAkcije from '../services/korisnici'
import loginAkcije from '../services/login'
import { useNavigate } from "react-router-dom";

const LoginView = (props) => {

    const [username, postaviUsername] = useState('')
    const [pass, postaviPass] = useState('')
    const [korisnik, postaviKorisnika] = useState(null)
    const navigiraj = useNavigate()
    

    const userLogin = async (e) => {
        e.preventDefault()
        try {
            const korisnik = await loginAkcije.prijava({
            username,
            pass
          })
          window.localStorage.setItem('prijavljeniKorisnik', JSON.stringify(korisnik)) 
          postaviKorisnika(korisnik)
          navigiraj(`/${korisnik.uloga}`)
          window.location.reload(0)
          postaviUsername('')
          postaviPass('')
          console.log(korisnik)
        } catch (exception) {
          alert('Neispravni podaci')
        }
    }
    
    

    useEffect( () => {
        const logiraniKorisnikJSON = window.localStorage.getItem('prijavljeniKorisnik')
        if (logiraniKorisnikJSON) {
          const korisnik = JSON.parse(logiraniKorisnikJSON)
          postaviKorisnika(korisnik)
          isporukeAkcije.postaviToken(korisnik.token)
          proizvodiAkcije.postaviToken(korisnik.token)
          korisniciAkcije.postaviToken(korisnik.token)
        }
    }, [])

    const preusmjeriNaPocetnu = () => {
      navigiraj('/')
    }
    const stil = {marginTop: 10, height: '100%', width: 50, fontSize: 30, textAlign: 'center'}
    return (
      <div>
        <button onClick={preusmjeriNaPocetnu} style={stil}> ⌂ </button>
        <LoginForma
          username={username}
          pass={pass}
          postaviUsername={({ target }) => postaviUsername(target.value)}
          postaviPass={({ target }) => postaviPass(target.value)}
          userLogin={userLogin}
          kor={korisnik}
        />
      </div>
    )

}

export default LoginView
