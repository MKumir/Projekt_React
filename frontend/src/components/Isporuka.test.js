import React from "react";
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import Isporuka from "./Isporuka";

test('Renderiranje atributa isporuke', () => {
    
    const isporuka = {
        proizvod: "TestProizvod",
        kolicina: 20,
        sektor: "TestSektor",
        status: true
    }

    const komponenta = render (
    <Isporuka isporuka={isporuka} />
    )

    expect(komponenta.container).toHaveTextContent('TestSektor')
    expect(komponenta.container).toHaveTextContent(20)
    

    // const element = komponenta.getByText('TestProizvod')
    // expect(element).not.toBe(null)

})

test('Klik poziva event handler', () => {
    const isporuka = {
        proizvod: "TestProizvod",
        kolicina: 20,
        sektor: "TestSektor",
        status: true
    }

    const testHandler = jest.fn()
    const testHandler2 = jest.fn()
    
    const komponenta = render (
        <Isporuka 
            isporuka={isporuka} 
            promjenaStatusa={testHandler}
            brisiIsporuku={testHandler2} 
        />
    )

    const btnPromjenaStatusa = komponenta.getByText('označi kao neisporučeno')
    const btnBrisi = komponenta.getByText('X')
    fireEvent.click(btnPromjenaStatusa)
    fireEvent.click(btnBrisi)

    expect(testHandler.mock.calls).toHaveLength(1)
    expect(testHandler2.mock.calls).toHaveLength(1)

})
