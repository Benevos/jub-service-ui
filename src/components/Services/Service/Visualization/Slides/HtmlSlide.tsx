"use client"

import React, { useEffect, useState } from 'react'
import LoadingSlide from './LoadingSlide'
import PerformanceSlide from './PerformanceSlide'

interface HtmlSlideProps {
    src: string
    performance?: boolean
}

function HtmlSlide({ src, performance=false }: HtmlSlideProps)
{
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    useEffect(() =>
    {
        if (performance) return

        const controller = new AbortController()

        const loadHtml = async () =>
        {
            try
            {
                const response = await fetch(src, {
                    signal: controller.signal
                })

                const blob = await response.blob()

                const url = URL.createObjectURL(blob)

                setBlobUrl(url)
            }
            catch(error)
            {
                if ((error as Error).name !== "AbortError")
                {
                    console.log("Peticion abordata")
                }
            }
        }

        loadHtml()

        return () =>
        {
            controller.abort()

            if (blobUrl)
            {
                URL.revokeObjectURL(blobUrl)
            }
        }

    }, [src, performance])

    if (performance) {
        return <PerformanceSlide href={src} />
    }

    if (!blobUrl) {
        return <LoadingSlide />
    }

    return (
        <>
            {
                performance ? 
                    <PerformanceSlide href={src}/>
                :
                <iframe
                    className='embla__slide w-full h-full bg-black'
                    src={blobUrl}
                />
            }
        </>
    )
}

export default HtmlSlide