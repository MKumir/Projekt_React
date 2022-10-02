import React, { useState, useEffect } from 'react'
import Isporuka from '../components/Isporuka'
import isporukeAkcije from '../services/isporuke'


const PrikazIsporukaRadnik = () => {

    const [isporuke, postaviIsporuke] = useState([])
    const [unosSektora, postaviUnosSektora] = useState('svi')

    const promjenaUnosaSektora = (e) => {
        postaviUnosSektora(e.target.value)
    }

    const isporukeZaIspis = isporuke.filter(i => i.status === false)

    const filtriraneIsporuke = isporukeZaIspis.filter( i => {
        if(unosSektora === 'svi'){
            return i
        }
        else {
            if(i.sektor.includes(unosSektora)) {
                return i
            }
        }
        return null
    })

    const promjenaStatusaIsporuke = (id) => {
        const isporuka = isporuke.find(i => i.id === id)
        const modIsporuka = {
          ...isporuka,
          status: !isporuka.status
        }
    
        isporukeAkcije.osvjezi(id, modIsporuka).then(res => {
          console.log(res.data)
          postaviIsporuke(isporuke.map(i => i.id !== id ? i : res.data))
          window.location.reload(0)
        })
    }

    useEffect( () => {
        isporukeAkcije.dohvatiSve().then(res => {
            console.log(res.data)
            postaviIsporuke(res.data)})        
    }, [])



    return (
        <div style={{marginTop: 50}}>
            <label style={{fontSize: '14px'}}>Filtriraj isporuke po sektoru:</label>
                <select value={unosSektora} onChange={promjenaUnosaSektora}>
                    <option value="svi">svi</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>
            <table>
                <thead>
                    <tr>
                        <th>PROIZVOD</th>
                        <th>KOLICINA</th>
                        <th>SEKTOR</th>
                    </tr>
                </thead>
                <tbody>
                {filtriraneIsporuke.map(fi =>
                    <Isporuka  
                        key={fi.id} 
                        isporuka={fi}
                        promjenaStatusa={() => promjenaStatusaIsporuke(fi.id)}
                        sakrijBrisi={true}
                    />
                )}
                </tbody>
            </table>
      </div>
    )

}

export default PrikazIsporukaRadnik;
