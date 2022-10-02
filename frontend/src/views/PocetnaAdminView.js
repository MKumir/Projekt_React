import React from "react";
import NaslovniDio from "../components/NaslovniDio";
import KorisnikUnosForma from "../components/KorisnikUnosForma";
import PrikazKorisnika from "../components/PrikazKorisnika";
import { useNavigate } from "react-router-dom";

const PocetnaAdminView = ({korisnik}) => {

    const navigiraj = useNavigate()

    const odjavaKorisnika = () => {
        window.localStorage.clear()
        navigiraj('/')
        window.location.reload(0)
    }


    return (
        <div> 
            <NaslovniDio korisnik={korisnik} odjava={odjavaKorisnika}/>
            <KorisnikUnosForma />
            <PrikazKorisnika />
        </div>
    )
}

export default PocetnaAdminView;