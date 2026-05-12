"use client"

import { Button } from '@mui/material'
import { FaRegQuestionCircle } from 'react-icons/fa'

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
                <div className='flex flex-col items-center mb-2'>
                    <FaRegQuestionCircle color='white' size={40}/>

                    <span className='text-white font-bold my-2'>
                        Formato no soportado directamente
                    </span>
                </div>

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