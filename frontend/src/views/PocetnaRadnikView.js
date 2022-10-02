import React from "react";
import NaslovniDio from "../components/NaslovniDio";
import PrikazIsporukaRadnik from "../components/PrikazIsporukaRadnik";
import { useNavigate } from "react-router-dom";

const PocetnaRadnikView = ({korisnik}) => {

    const navigiraj = useNavigate()

    const odjavaKorisnika = () => {
        window.localStorage.clear()
        navigiraj('/')
        window.location.reload(0)
    }

    return (
        <div> 
            <NaslovniDio korisnik={korisnik} odjava={odjavaKorisnika}/>
            <PrikazIsporukaRadnik />
        </div>
    )

}

export default PocetnaRadnikView;