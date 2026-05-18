"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import FallbackSlide from './FallbackSlide'

//TODO: Show download progress

interface ImageSlideInterface {
    src: string
    alt: string
    filename?: string
    extension?: string | null | undefined
}

function ImageSlide({ src, alt, filename, extension }: ImageSlideInterface) 
{
    const [failed, setFailed] = useState(false)

    if (failed)
    {
        return (
            <FallbackSlide href={src} filename={filename} extension={extension}/>
        )
    }

    return (
        <div className="embla__slide relative bg-black">
            <Image
                src={src}
                alt={alt}
                fill
                className='object-contain'
                unoptimized
                onError={() => setFailed(true)}
            />
        </div>
    )
}

export default ImageSlide