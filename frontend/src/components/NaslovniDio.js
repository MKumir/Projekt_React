import React from "react";

const NaslovniDio = ({korisnik, odjava}) => {
    return (
        <div>
            <h1>Skladište</h1>
            <p>Uloga: {korisnik.uloga}</p>
            <p>Prijavljeni ste kao: {korisnik.ime} {korisnik.prezime}</p>
            <button onClick={odjava}>Odjavi se</button>
        </div>
    )
}

export default NaslovniDio;