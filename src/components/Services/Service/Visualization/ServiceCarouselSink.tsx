import ProductType from '@/types/products'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useEffect, useState } from 'react'
import HtmlSlide from './Slides/HtmlSlide'
import { useAppSelector } from '@/lib/hooks'
import FallbackSlide from './Slides/FallbackSlide'
import ImageSlide from './Slides/ImageSlide'
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

interface ServiceCarouselProps {
    sources: ProductType[]
}

function ServiceCarouselSink({ sources }: ServiceCarouselProps) 
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
                        sources.map(source => {
                            if(!source.metadata) {
                                return <FallbackSlide key={source.product_id} href={`https://apix.tamps.cinvestav.mx/jub/api/v2/products/${source.product_id}/download`}/>
                            }
                            
                            if(!source.metadata.extension) {
                                return <FallbackSlide key={source.product_id} href={`https://apix.tamps.cinvestav.mx/jub/api/v2/products/${source.product_id}/download`}/>
                            } 

                            const extension = source.metadata.extension.toLowerCase()

                            switch(extension)
                            {
                                case "html": 
                                {
                                    return (
                                        <HtmlSlide 
                                            performance={servicePerformanceMode}
                                            key={source.product_id} 
                                            src={`https://apix.tamps.cinvestav.mx/jub/api/v2/products/${source.product_id}/download`}/>
                                    )
                                }
                                case "jpg":
                                {
                                    return (
                                        <ImageSlide
                                            alt={source.product_id}
                                            src={`https://jub.tamps.cinvestav.mx/${source.product_id}/download`}/>
                                    )
                                }
                            }

                            return <React.Fragment key={source.product_id}></React.Fragment>
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