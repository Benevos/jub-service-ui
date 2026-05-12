"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import FallbackSlide from './FallbackSlide'

interface ImageSlideInterface {
    src: string
    alt: string
}

function ImageSlide({ src, alt }: ImageSlideInterface) 
{
    const [failed, setFailed] = useState(false)

    if (failed)
    {
        return (
            <FallbackSlide href={src}/>
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