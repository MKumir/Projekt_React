import React from "react";

const LoginForma = ({
    userLogin,
    postaviUsername,
    postaviPass,
    username,
    pass,
    kor    
}) => (
  <div>
    <h1>Prijava</h1>
    <form onSubmit={userLogin}>
        <div>
          Korisničko ime: 
          <input 
            type="text" 
            value={username} 
            name="Username"
            onChange={postaviUsername}
            />
        </div>
        <div>
          Lozinka:
          <input 
            type="password" 
            value={pass} 
            name="Pass"
            onChange={postaviPass} />
        </div>
        <button style={{marginTop: 20, width: 100}} type="submit">Prijava</button>
      </form>
    </div>
)

export default LoginForma;
