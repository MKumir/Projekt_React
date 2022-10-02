import React, {useState, useEffect} from "react";
import proizvodiAkcije from '../services/proizvodi'

const ProizvodUnosForma = (props) => {
    const [proizvodi, postaviProizvode] = useState([])
    const [unosNaziva, postaviUnosNaziva] = useState("")
    const [unosKategorije, postaviUnosKategorije] = useState("Hrana")

    const promjenaUnosaNaziva = (e) => {
        postaviUnosNaziva(e.target.value)
    }
    const promjenaUnosaKategorije = (e) => {
        postaviUnosKategorije(e.target.value)
    }

    const noviProizvod = (e) =>{
        e.preventDefault()
        const noviObjekt = {
            naziv: unosNaziva,
            kategorija: unosKategorije,
        }
        proizvodiAkcije.stvori(noviObjekt).then(res => {
            console.log(res.data)
        postaviProizvode(proizvodi.concat(res.data))
        })
        
        postaviUnosNaziva('')
        postaviUnosKategorije('')
        if(!(unosNaziva === '' || unosKategorije === '')){
            window.location.reload(null)
        }
    }

    useEffect( () => {
        proizvodiAkcije.dohvatiSve().then(res => {
            console.log(res.data)
            postaviProizvode(res.data)})
    }, [])

    return (
    <div>
        <h2>Unesi Proizvod:</h2>
        <form onSubmit={noviProizvod}>
            <div>Naziv: 
                <input 
                    placeholder="Unesi naziv..." 
                    value={unosNaziva}  
                    onChange={promjenaUnosaNaziva}
                />
            </div>
            <div>Kategorija: 
                <select value={unosKategorije} onChange={promjenaUnosaKategorije}>q
                    <option value="Hrana">Hrana</option>
                    <option value="Pice">Pice</option>
                    <option value="Higijena">Higijena</option>
                    <option value="Tehnologija">Tehnologija</option>
                    <option value="Namjestaj">Namjestaj</option>
                </select>
            </div>
            <button style={{marginTop: 10}} type="submit">Spremi</button>
        </form>
      </div>
    )
}

export default ProizvodUnosForma;
