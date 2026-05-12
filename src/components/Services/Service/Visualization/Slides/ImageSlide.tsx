import Image from 'next/image'
import React from 'react'

interface ImageSlideInterface {
    src: string
    alt: string
}

function ImageSlide({ src, alt }: ImageSlideInterface) 
{
    return (
        <div
            className="embla__slide relative bg-black"
        >

            <Image
                src={src}
                alt={alt}
                fill
                className='object-contain'
            />
        </div>
    )
}

export default ImageSlide