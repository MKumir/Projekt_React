import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// const isporuke = [
//   {
//     id: 1,
//     proizvod: 'Banane',
//     kolicina: 5,
//     sektor: 'A',
//     datum: new Date(),
//     status: true
//   },
//   {
//     id: 2,
//     proizvod: 'Kruske',
//     kolicina: 10,
//     sektor: 'B',
//     datum: new Date(),
//     status: true
//   },
//   {
//     id: 3,
//     proizvod: 'Jabuke',
//     kolicina: 17,
//     sektor: 'C',
//     datum: new Date(),
//     status: false
//   }
// ]

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <App />
);

//ReactDOM.render(<App isporuke={isporuke}/>,document.getElementById('root'))
