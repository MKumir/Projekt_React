import React, { useState, useEffect} from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes/*Link, NavLink, Navigate, useLocation*/ } from 'react-router-dom'
import Pocetna from './views/Pocetna';
import LoginView from './views/LoginView';
import PocetnaAdminView from './views/PocetnaAdminView';
import PocetnaPoslovodaView from './views/PocetnaPoslovodaView'
import PocetnaRadnikView from './views/PocetnaRadnikView';
import IsporukePoslovodaView from './views/IsporukePoslovodaView'
import ProizvodiPoslovodaView from './views/ProizvodiPoslovodaView';


const App = () => {

  const nullKorisnik = {
    uloga: null
  }
  const [korisnik, postaviKorisnika] = useState(nullKorisnik)
  

  useEffect( () => {
    const logiraniKorisnikJSON = window.localStorage.getItem('prijavljeniKorisnik')
    if (logiraniKorisnikJSON) {
      const korisnik = JSON.parse(logiraniKorisnikJSON)
      postaviKorisnika(korisnik)
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Pocetna />} />
        <Route path='/login' element={<LoginView/>} />
        <Route path='/admin' element={korisnik.uloga === 'admin' ? <PocetnaAdminView korisnik={korisnik} />: <LoginView/>} />
        <Route path='/poslovoda' element={korisnik.uloga === 'poslovoda' ? <PocetnaPoslovodaView korisnik={korisnik} />: <LoginView/>} />
        <Route path='/poslovoda/isporuke' element= {korisnik.uloga === 'poslovoda' ? <IsporukePoslovodaView korisnik={korisnik}/> : <LoginView /> } />
        <Route path='/poslovoda/proizvodi' element={korisnik.uloga === 'poslovoda' ? <ProizvodiPoslovodaView korisnik={korisnik}/> : <LoginView />} />
        <Route path='/radnik' element={korisnik.uloga === 'radnik' ? <PocetnaRadnikView korisnik={korisnik}/> : <LoginView />} />
      </Routes>
    </Router>
  );

}

export default App
