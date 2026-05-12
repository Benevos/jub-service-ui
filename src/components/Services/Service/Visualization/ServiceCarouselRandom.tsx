import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import LoadingSlide from './Slides/LoadingSlide'

interface RandomImage {
    id: number
    url: string
}

interface ServiceCarouselProps {
    images: RandomImage[]
}

function ServiceCarouselRandom({ images }: ServiceCarouselProps) 
{
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})

    const [currentIndex, setCurrentIndex] = useState(0)

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false
    })

    const goToPrev = () => emblaApi?.scrollPrev()
    const goToNext = () => emblaApi?.scrollNext()

    useEffect(() => {

        if (!emblaApi) return

        const onSelect = () => {
            setCurrentIndex(emblaApi.selectedScrollSnap())
        }

        onSelect()

        emblaApi.on('select', onSelect)

        return () => {
            emblaApi.off('select', onSelect)
        }

    }, [emblaApi])

    return (
        <div className="embla relative">
            <div
                className="embla__viewport"
                ref={emblaRef}
            >
                <div className="embla__container h-[600px] max-md:h-[300px] ">

                    {images.map((image) => (

                        <div
                            key={image.id}
                            className="embla__slide relative bg-black"
                        >

                            {!loadedImages[image.id] && (
                                <LoadingSlide/>
                            )}

                            <Image
                                src={image.url}
                                alt={`Random image ${image.id}`}
                                fill
                                className='object-contain'
                                onLoad={() =>
                                    setLoadedImages(prev => ({
                                        ...prev,
                                        [image.id]: true
                                    }))
                                }
                            />
                        </div>

                    ))}

                </div>
            </div>

            <div className='absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-white px-4 py-2 shadow'>
                <span className='font-bold'>
                    {currentIndex + 1}/{images.length}
                </span>
            </div>

            <button
                onClick={goToPrev}
                className='absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow'
            >
                Prev
            </button>

            <button
                onClick={goToNext}
                className='absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow'
            >
                Next
            </button>

        </div>
    )
}

export default ServiceCarouselRandom