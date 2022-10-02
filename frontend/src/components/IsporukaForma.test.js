import React from "react";
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import IsporukaForma from "./IsporukaUnosForma";

test('<IsporukaForma> poziva onSubmit i mijenja stanje roditelja', () => {
    const stvoriIsporuku = jest.fn()

    const komponenta = render (
        <IsporukaForma spremiIsporuku={stvoriIsporuku} />
    )

    const inputProizvod = komponenta.container.querySelector('input')
    console.log(inputProizvod)
    const inputKolicina = komponenta.container.querySelector('input[type="number"]')
    console.log(inputKolicina)
    const selectSektor = komponenta.container.querySelector('select')
    const forma = komponenta.container.querySelector('form')

    fireEvent.change(inputProizvod, {
        target: {value: 'Testiranje unosa proizvoda u formu'}
    })

    fireEvent.change(inputKolicina, {
        target: {value: 5}
    })

    fireEvent.change(selectSektor, {
        target: {value: 'D'}
    })
    fireEvent.submit(forma)

    expect(stvoriIsporuku.mock.calls).toHaveLength(1)
    
    expect(stvoriIsporuku.mock.calls[0][0].proizvod).toBe('Testiranje unosa proizvoda u formu')
    expect(stvoriIsporuku.mock.calls[0][0].kolicina).toBe(5)
    expect(stvoriIsporuku.mock.calls[0][0].sektor).toBe('D')

})
