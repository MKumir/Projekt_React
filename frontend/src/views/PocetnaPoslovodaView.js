import React from "react";
import NaslovniDio from "../components/NaslovniDio";
import { useNavigate } from "react-router-dom";

const PocetnaPoslovodaView = ({korisnik}) => {

    const navigiraj = useNavigate()

    const odjavaKorisnika = () => {
        window.localStorage.clear()
        navigiraj('/')
        window.location.reload(0)
    }

    const stil = {marginTop: 40, height: 100, width: 350, fontSize: 20}

    const preusmjeriNaProizvode = () => {
        navigiraj('/poslovoda/proizvodi')
    }
    const preusmjeriNaIsporuke = () => {
        navigiraj('/poslovoda/isporuke')
    }

    return (
        <div>
            <NaslovniDio korisnik={korisnik} odjava={odjavaKorisnika}/> 
            <button onClick={preusmjeriNaProizvode} style={stil}>Proizvodi</button>
            <button onClick={preusmjeriNaIsporuke} style={stil}>Isporuke</button>
        </div>
    )
}

export default PocetnaPoslovodaView;

