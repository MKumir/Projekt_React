import React from "react";
import NaslovniDio from "../components/NaslovniDio";
import IsporukaUnosForma from "../components/IsporukaUnosForma";
import PrikazIsporuka from "../components/PrikazIsporuka";
import { useNavigate } from "react-router-dom";

const IsporukePoslovodaView = ({korisnik}) => {

    const navigiraj = useNavigate()

    const odjavaKorisnika = () => {
        window.localStorage.clear()
        navigiraj('/')
        window.location.reload(0)
    }

    const preusmjeriNaPocetnu = () => {
        navigiraj('/poslovoda')
    }

    const vrati = {marginTop: 20, height: 45, width: 40, fontSize: 25, textAlign: 'center'}

    return (
        <div> 
            <NaslovniDio korisnik={korisnik} odjava={odjavaKorisnika}/>
            <button onClick={preusmjeriNaPocetnu} style={vrati}>⏎</button>
            <IsporukaUnosForma />
            <PrikazIsporuka />
        </div>
    )

}

export default IsporukePoslovodaView;