import React from "react";
import './Isporuka.css'

const Isporuka = ({isporuka, promjenaStatusa, brisiIsporuku, sakrijBrisi}) => {
    const oznaka = isporuka.status
    ? 'označi kao neisporučeno' : 'označi kao isporučeno'

    return (
        <tr className={isporuka.status ? 'isporuceno' : 'neisporuceno'}>
            <td>{isporuka.proizvod['naziv']}</td>
            <td>{isporuka.kolicina}</td>
            <td>{isporuka.sektor}</td>
            <td><button onClick={promjenaStatusa} style={{fontSize: '12px'}}>{oznaka}</button></td>
            <td hidden={sakrijBrisi} ><button className="brisiBtn" onClick={brisiIsporuku}>X</button></td>
        </tr>
    )
}

export default Isporuka
