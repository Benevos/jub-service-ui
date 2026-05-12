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
        if(performance) return

        const loadHtml = async () =>
        {
            const response = await fetch(src)

            const blob = await response.blob()

            const url = URL.createObjectURL(blob)

            setBlobUrl(url)
        }

        loadHtml()

        return () =>
        {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl)
            }
        }

    }, [src])

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