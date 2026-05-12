import { Button } from '@mui/material'
import React from 'react'
import { CgPerformance } from 'react-icons/cg'

interface PerformanceSlideProps {
    href: string
}

function PerformanceSlide({ href }: PerformanceSlideProps) {
    return (
        <div className='embla__slide w-full h-full flex flex-col items-center justify-center bg-black'>
                <div className='flex flex-col items-center mb-2'>
                    <CgPerformance color='white' size={40}/>

                    <span className='text-white font-bold my-2'>
                        Modo rendimiento activo
                    </span>
                </div>
                
                <Button href={href} variant='contained'>DESCARGAR PARA VER</Button>
        </div>
    )
}

export default PerformanceSlide