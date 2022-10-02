import React, { useState, useEffect } from 'react'
import Korisnik from './Korisnik'
import korisniciAkcije from '../services/korisnici'


const PrikazKorisnika = () => {

    const [korisnici, postaviKorisnike] = useState([])
    const [unosUloge, postaviUnosUloge] = useState('svi')

    const promjenaUnosaUloge = (e) =>{
        postaviUnosUloge(e.target.value)
    }

    const filtriraniKorisnici = korisnici.filter( fk => {
        if(unosUloge === 'svi'){
            return fk
        }
        else {
            if(fk.uloga.includes(unosUloge)) {
                return fk
            }
        }
        return null
    })
    
    const brisiKorisnika = (id) => {
        korisniciAkcije.brisi(id).then(res => {
          console.log(res)
          postaviKorisnike(korisnici.filter(i => i.id !== id))
        })
    }

    useEffect( () => {
        korisniciAkcije.dohvatiSve().then(res => {
            console.log(res.data)
            postaviKorisnike(res.data)})        
    }, [])
    

    return (
        <div>
            <h4 style={{marginBottom: 5}}>Korisnici</h4>
            <label style={{fontSize: '14px'}}>Filtriraj korisnike po ulozi:</label>
            <select value={unosUloge} onChange={promjenaUnosaUloge}>
                <option value="svi">svi</option>
                <option value="radnik">radnik</option>
                <option value="poslovoda">poslovoda</option>
            </select>
            <table>
                <thead >
                    <tr>
                        <th>IME</th>
                        <th>PREZIME</th>
                        <th>ULOGA</th>
                        <th>USERNAME</th>
                    </tr>
                </thead>
                <tbody>
                {filtriraniKorisnici.map((k) => (
                    k.uloga === 'admin' 
                    ? ( <Korisnik 
                        key={k.id}
                        korisnik={k}
                        sakrijBrisi={true}
                        />
                    )
                    : ( <Korisnik  
                        key={k.id} 
                        korisnik={k}
                        brisiKorisnika={() => brisiKorisnika(k.id)}
                        />
                    )
                ))}
                </tbody>
            </table>
      </div>
    )

}

export default PrikazKorisnika;
