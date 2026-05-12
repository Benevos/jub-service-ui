import React, { useEffect, useState } from 'react'

function LoadingSlide() 
{
    const [showPerformanceSuggestion, setShowPerformanceSuggestion] = useState(false)

    useEffect(() => {

        const timeout = setTimeout(() => {
            setShowPerformanceSuggestion(true)
        }, 5000)

        return () => clearTimeout(timeout)

    }, [])

    return (
        <div className='embla__slide w-full h-full flex flex-col items-center justify-center bg-black gap-6'>

            <div className='h-12 w-12 rounded-full border-4 border-gray-300 border-t-white animate-spin'/>

            {
                showPerformanceSuggestion &&
                (
                    <div className='text-center px-6 max-w-md'>
                        <span className='text-white font-bold block mb-2'>
                            La carga está tardando más de lo esperado
                        </span>

                        <span className='text-gray-300 text-sm'>
                            Puede activar el modo rendimiento para mejorar los tiempos de visualización.
                        </span>
                    </div>
                )
            }

        </div>
    )
}

export default LoadingSlide