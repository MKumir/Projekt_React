import React from "react";

const Proizvod = ({proizvod, brisiProizvod}) => {

    return (
        <tr>
            <td>{proizvod.naziv}</td>
            <td>{proizvod.kategorija}</td>
            <td><button className='brisiBtn' onClick={brisiProizvod}>X</button></td>
        </tr>
    )
}

export default Proizvod
