import React, { useState, useEffect } from 'react'
import Proizvod from '../components/Proizvod'
import proizvodiAkcije from '../services/proizvodi'


const PrikazProizvoda = () => {

    const [proizvodi, postaviProizvode] = useState([])
    const [unosKategorije, postaviUnosKategorije] = useState('sve')

    const promjenaUnosaKategorije = (e) => {
        postaviUnosKategorije(e.target.value)
    }

    const filtriraniProizvodi = proizvodi.filter( fp => {
        if(unosKategorije === 'sve'){
            return fp
        }
        else {
            if(fp.kategorija.includes(unosKategorije)) {
                return fp
            }
        }
        return null
    })
    
    const brisiProizvod = (id) => {
        proizvodiAkcije.brisi(id).then(res => {
          console.log(res)
          postaviProizvode(proizvodi.filter(i => i.id !== id))
        })
    }

    useEffect( () => {
        proizvodiAkcije.dohvatiSve().then(res => {
            console.log(res.data)
            postaviProizvode(res.data)})        
    }, [])

    

    return (
        <div style={{marginTop: 30}}>
            <label style={{fontSize: '14px'}}>Filtriraj proizvode po kategoriji:</label>
                <select value={unosKategorije} onChange={promjenaUnosaKategorije}>
                    <option value="sve">sve</option>
                    <option value="Hrana">Hrana</option>
                    <option value="Pice">Pice</option>
                    <option value="Higijena">Higijena</option>
                    <option value="Tehnologija">Tehnologija</option>
                    <option value="Namjestaj">Namjestaj</option>
                </select>
            <table>
                <thead>
                    <tr>
                        <th>NAZIV</th>
                        <th>KATEGORIJA</th>
                    </tr>
                </thead>
                <tbody>
                {filtriraniProizvodi.map(p =>
                    <Proizvod  
                        key={p.id} 
                        proizvod={p}
                        brisiProizvod={() => brisiProizvod(p.id)}
                    />
                )}
                </tbody>
            </table>
      </div>
    )

}

export default PrikazProizvoda;
