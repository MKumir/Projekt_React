import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap-v5"
import { useNavigate } from "react-router-dom";

const Pocetna = () => {

    const navigiraj = useNavigate()
    const preusmjeriNaLogin = () => {
        navigiraj('/login')
    }
    const stil = {marginTop: 20, height: 40, width: 110, textAlign: 'center'}

    return (
        <div>
            <h1>Skladište</h1>
            <button onClick={preusmjeriNaLogin} style={stil}>Prijavi se</button>
        </div>
    )
}

export default Pocetna;
