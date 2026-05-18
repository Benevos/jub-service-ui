'use client'

import { Button, LinearProgress } from '@mui/material'
import React, { useState } from 'react'
import { CgPerformance } from 'react-icons/cg'
import axios, { AxiosProgressEvent } from 'axios'
import { showSnackbar } from '@/lib/features/snackbar/snackbarSlice'
import { useAppDispatch } from '@/lib/hooks'

interface PerformanceSlideProps {
    href: string
    filename?: string | null | undefined
    extension?: string | null | undefined
}

function PerformanceSlide({ href, filename, extension }: PerformanceSlideProps) 
{
    const dispatch = useAppDispatch()

    const [progress, setProgress] = useState(0)
    const [downloading, setDownloading] = useState(false)
    const [error, setError] = useState(false);

    const handleDownload = async () =>
    {
        try
        {
            setDownloading(true)
            setProgress(0)

            const response = await axios.get(href, {
                responseType: 'blob',

                onDownloadProgress: (progressEvent: AxiosProgressEvent) =>
                {
                    // Algunos servidores no envían content-length
                    if (!progressEvent.total) return

                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )

                    setProgress(percent)
                }
            })

            const blob = response.data

            const url = window.URL.createObjectURL(blob)

            const a = document.createElement('a')

            a.href = url
            a.download = filename ? filename : 'archivo'

            document.body.appendChild(a)

            a.click()

            a.remove()

            window.URL.revokeObjectURL(url)

            setProgress(100)
        }
        catch(error)
        {
            setError(true)

            let errorMessage = 'Error al descargar archivo.'

            if (axios.isAxiosError(error))
            {
                if (error.response?.status === 404)
                {
                    errorMessage = 'Archivo no encontrado o inexistente.'
                }

                errorMessage = `(${error.response?.status}) ${errorMessage}`
            }

            dispatch(showSnackbar({
                severity: "error",
                message: errorMessage,
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "center"
                }
            }))
        }
        finally
        {
            // Espera pequeña para que el usuario vea el 100%
            setTimeout(() =>
            {
                setError(false)
                setDownloading(false)
                setProgress(0)
            }, 800)
        }
    }

    return (
        <div className='embla__slide w-full h-full flex flex-col items-center justify-center bg-black px-4'>
            
            <div className='flex flex-col items-center mb-4'>
                <CgPerformance color='white' size={40}/>

                <span className='text-white font-bold my-2'>
                    Modo rendimiento activo
                </span>
            </div>


            {
                !downloading ?
                    <Button
                    onClick={handleDownload}
                    variant='contained'
                    disabled={downloading}
                    >
                        DESCARGAR PARA VER {extension ? `(${extension.toLocaleUpperCase()})` : ""}  
                    </Button>
                :
                    <div className='w-full max-w-md max-md:w-[200px]'>

                        <div className='text-white flex items-center justify-center mb-2'>
                            {error ? "Error al descargar" : `Descargando: ${progress}%`}
                        </div>
                        

                        <LinearProgress
                            color={error ? "error" : "primary"}
                            variant='determinate'
                            value={progress}
                        />

                        
                    </div>
            }

        </div>
    )
}

export default PerformanceSlide