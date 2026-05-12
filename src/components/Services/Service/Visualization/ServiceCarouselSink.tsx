import ProductType from '@/types/products'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useEffect, useState } from 'react'
import HtmlSlide from './Slides/HtmlSlide'
import { useAppSelector } from '@/lib/hooks'
import FallbackSlide from './Slides/FallbackSlide'
import ImageSlide from './Slides/ImageSlide'
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import LoadingSlide from './Slides/LoadingSlide'

interface ServiceCarouselProps {
    sources: ProductType[]
    loading: boolean
}

function ServiceCarouselSink({ sources, loading }: ServiceCarouselProps) 
{
    const servicePerformanceMode = useAppSelector(state => state.services.performanceMode)

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

    if(loading)
    {
        return (
            <div className='h-[600px] max-md:h-[300px] flex flex-col items-center justify-center bg-black gap-6 '>
                <div className='h-12 w-12 rounded-full border-4 border-gray-300 border-t-white animate-spin'/>
            </div>
        )
    }


    if (sources.length === 0)
    {
        return (
            <div className="h-[600px] max-md:h-[300px] bg-black text-white font-bold flex items-center justify-center text-lg">
                <span>Sin datos ligados</span>
            </div>
        )
    }

    return (
        <div className="embla relative">
            <div
                className="embla__viewport"
                ref={emblaRef}
            >
                <div className="embla__container h-[600px] max-md:h-[300px] ">

                    {
                        sources.map((source, index) => {
                            const src = `https://apix.tamps.cinvestav.mx/jub/api/v2/products/${source.product_id}/download`

                            const key = `${source.product_id}-${index}`


                            const shouldRender =
                                index === currentIndex ||
                                index === currentIndex - 1 ||
                                index === currentIndex + 1

                            if(source.metadata?.extension?.toLowerCase() === "html")
                            {
                                return (
                                    <HtmlSlide
                                        key={key}
                                        performance={servicePerformanceMode}
                                        src={src}
                                    />
                                )
                            }

                            return (
                                <ImageSlide
                                    key={key}
                                    alt={source.product_id}
                                    src={src}
                                />
                            )
                        })
                    }
                    
                </div>
            </div>

            <div className='absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-white px-4 py-2 shadow'>
                <span className='font-bold'>
                    {currentIndex + 1}/{sources.length}
                </span>
            </div>

            <button
                onClick={goToPrev}
                className='absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow'
            >
                <GrCaretPrevious size={25}/>
            </button>

            <button
                onClick={goToNext}
                className='absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow'
            >
                <GrCaretNext size={25}/>
            </button>

        </div>
    )
}

export default ServiceCarouselSink