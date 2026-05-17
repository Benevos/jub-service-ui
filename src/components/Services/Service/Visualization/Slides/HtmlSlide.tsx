"use client"

import React, { useEffect, useState } from 'react'
import PerformanceSlide from './PerformanceSlide'
import axios, { AxiosProgressEvent } from 'axios'
import LoadingSlide from './LoadingSlide'

interface HtmlSlideProps {
    src: string
    performance?: boolean
}

function HtmlSlide({ src, performance=false }: HtmlSlideProps)
{
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() =>
    {
        if (performance) return

        const controller = new AbortController()

        const loadHtml = async () =>
        {
            try
            {
                setLoading(true)
                setProgress(0)

                const response = await axios.get(src, {
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

        loadHtml()

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

    }, [src, performance])

    if (performance)
    {
        return <PerformanceSlide href={src} />
    }

    if (!blobUrl)
    {
        return (
            <LoadingSlide progress={progress}/>
        )
    }

    return (
        <iframe
            className='embla__slide w-full h-full bg-black'
            src={blobUrl}
        />
    )
}

export default HtmlSlide