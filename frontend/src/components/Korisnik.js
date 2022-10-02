import React from "react";

const Korisnik = ({korisnik, brisiKorisnika, sakrijBrisi}) => {

    return (
        <tr>
            <td>{korisnik.ime}</td>
            <td>{korisnik.prezime}</td>
            <td>{korisnik.uloga}</td>
            <td>{korisnik.username}</td>
            <td hidden={sakrijBrisi}><button className='brisiBtn' onClick={brisiKorisnika}>X</button></td>
        </tr>
    )
}

export default Korisnik
