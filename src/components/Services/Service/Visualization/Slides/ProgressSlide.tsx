import { LinearProgress } from '@mui/material'
import React from 'react'

interface ProgressSlideProps {
    progress: number
}

function ProgressSlide({ progress } : ProgressSlideProps) 
{
    return (
        <div className='embla__slide w-full h-full flex flex-col items-center justify-center bg-black px-4'>
            <div className='w-full max-w-md max-md:w-[200px] mt-4'>
                
                <div className='text-white flex items-center justify-center mb-2'>
                    Cargando: {progress}%
                </div>

                <LinearProgress
                    variant='determinate'
                    value={progress}
                />
            </div>
        </div>
    )
}

export default ProgressSlide