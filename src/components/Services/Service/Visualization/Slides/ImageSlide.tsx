"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import FallbackSlide from './FallbackSlide'
import axios, { AxiosProgressEvent } from 'axios'
import { useAppDispatch, useAppRequiredAuth } from '@/lib/hooks'
import { showSnackbar } from '@/lib/features/snackbar/snackbarSlice'
import LoadingSlide from './LoadingSlide'

//TODO: Show download progress

interface ImageSlideInterface {
    src: string
    alt: string
    filename?: string
    extension?: string | null | undefined
}

function ImageSlide({ src, alt, filename, extension }: ImageSlideInterface) 
{
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const auth = useAppRequiredAuth()

    useEffect(() =>
    {
        const controller = new AbortController()

        const loadImage = async () =>
        {
            try
            {
                setLoading(true)
                setProgress(0)

                const response = await axios.get(src, {
                    headers: {
                        "Authorization": `Bearer ${auth.access_token}`,
                        "Temporal-Secret-Key": auth.temporal_secret_key,
                    },
                    responseType: 'blob',
                    signal: controller.signal,

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

                const url = URL.createObjectURL(blob)

                setBlobUrl(url)

                setProgress(100)
            }
            catch(error)
            {
                if (!axios.isCancel(error))
                {
                    console.log("Petición abortada o error")
                }
            }
            finally
            {
                setTimeout(() =>
                {
                    setLoading(false)
                }, 300)
            }
        }

        loadImage()

        return () =>
        {
            controller.abort()

            setBlobUrl((prev) =>
            {
                if (prev)
                {
                    URL.revokeObjectURL(prev)
                }

                return null
            })
        }

    }, [src])

    if (error)
    {
        return (
            <FallbackSlide href={src} filename={filename} extension={extension}/>
        )
    }

    if (!blobUrl && progress >= 100)
    {
        return (
            <FallbackSlide href={src} extension={extension} filename={filename}/>
        )
    }

    if (!blobUrl)
    {
        return (
            <LoadingSlide progress={progress}/>
        )
    }

    return (
        <div className="embla__slide relative bg-black">
            <Image
                src={blobUrl}
                alt={alt}
                fill
                className='object-contain'
                unoptimized
                onError={() => setError(true)}
            />
        </div>
    )
}

export default ImageSlide