import React, { useState, useEffect } from 'react'
import Isporuka from '../components/Isporuka'
import isporukeAkcije from '../services/isporuke'


const PrikazIsporuka = () => {

    const [isporuke, postaviIsporuke] = useState([])
    const [ispisSve, postaviIspis] = useState(true)
    const [unosSektora, postaviUnosSektora] = useState('svi')

    const promjenaUnosaSektora = (e) => {
        postaviUnosSektora(e.target.value)
    }

    const filtriraneIsporuke = isporuke.filter( i => {
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

    const isporukeZaIspis = ispisSve
    ? filtriraneIsporuke
    : filtriraneIsporuke.filter(i => i.status === true)

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
    
    const brisiIsporuku = (id) => {
        isporukeAkcije.brisi(id).then(res => {
          console.log(res)
          postaviIsporuke(isporuke.filter(i => i.id !== id))
        })
    }

    useEffect( () => {
        isporukeAkcije.dohvatiSve().then(res => {
            console.log(res.data)
            postaviIsporuke(res.data)})        
    }, [])

    

    return (
        <div>
            <div style={{fontSize: '14px', display: 'inline'}}>
                <button style={{marginTop: 20}} onClick={() => postaviIspis(!ispisSve)}>
                    Prikaži { ispisSve ? "isporučene" : "sve"}
                </button>
                <label style={{marginLeft: 140}}>Filtriraj isporuke po sektoru:</label>
                <select value={unosSektora} onChange={promjenaUnosaSektora}>
                    <option value="svi">svi</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>
            </div>
            <table style={{marginTop: 10}}>
                <thead>
                    <tr>
                        <th>PROIZVOD</th>
                        <th>KOLICINA</th>
                        <th>SEKTOR</th>
                    </tr>
                </thead>
                <tbody>

                {isporukeZaIspis.map(fi => 
                    <Isporuka 
                        key={fi.id} 
                        isporuka={fi}
                        promjenaStatusa={() => promjenaStatusaIsporuke(fi.id)}
                        brisiIsporuku={() => brisiIsporuku(fi.id)}
                    />
                )}
                </tbody>
            </table>
      </div>
    )

}

export default PrikazIsporuka;
