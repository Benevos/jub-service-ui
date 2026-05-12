"use client";

import React from 'react'

function TestPage() 
{
    const handleClick = async () =>
    {
        
        const url = "https://jub.tamps.cinvestav.mx/0c5fa6ad-d4e3-4064-ae2d-94cfbb61b3db/download"

        const a = document.createElement("a")

        a.href = url

        a.download = "archivo"

        document.body.appendChild(a)

        a.click()

        a.remove()

        window.URL.revokeObjectURL(url)
    }

    return (
        <div>
            <button onClick={handleClick}>
                Descargar
            </button>
        </div>
    )
}

export default TestPage