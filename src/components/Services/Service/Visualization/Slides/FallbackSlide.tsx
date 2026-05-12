import { Button } from '@mui/material'
import React from 'react'

interface FallbackSlideProps {
    href: string
}

function FallbackSlide({ href }: FallbackSlideProps) {
    return (
        <div className='embla__slide w-full h-full flex flex-col items-center justify-center bg-black'>
                <span className='text-white font-bold mb-5'>
                    Formato no soportado directamente
                </span>
                <Button href={href} variant='contained'>DESCARGAR PARA VER</Button>
        </div>
    )
}

export default FallbackSlide