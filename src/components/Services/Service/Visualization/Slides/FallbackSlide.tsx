"use client"

import { Button } from '@mui/material'

interface FallbackSlideProps {
    href: string
}

function FallbackSlide({ href }: FallbackSlideProps) 
{
    const handleDownload = async () =>
    {
        try
        {
            const response = await fetch(href)

            if (!response.ok)
            {
                let errorMessage = ""

                if (response.status === 404)
                {
                    errorMessage = "Archivo no enocontrado o inexistente."
                }

                throw new Error(`(${response.status}) ${errorMessage}`)
            }

            const blob = await response.blob()

            const url = window.URL.createObjectURL(blob)

            const a = document.createElement("a")

            a.href = url
            a.download = "archivo"

            document.body.appendChild(a)

            a.click()

            a.remove()

            window.URL.revokeObjectURL(url)
        }
        catch(error)
        {
            alert(error)
        }
    }

    return (
        <>
            

            <div className='embla__slide w-full h-full flex flex-col items-center justify-center bg-black'>
                <span className='text-white font-bold mb-5'>
                    Formato no soportado directamente
                </span>

                <Button
                    variant='contained'
                    onClick={handleDownload}
                >
                    DESCARGAR PARA VER
                </Button>
            </div>
        </>
    )
}

export default FallbackSlide