import ProductType from '@/types/products'
import useEmblaCarousel from 'embla-carousel-react'
import { ChangeEvent, useEffect, useState } from 'react'
import HtmlSlide from '../Slides/HtmlSlide'
import { useAppSelector } from '@/lib/hooks'
import ImageSlide from '../Slides/ImageSlide'
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import NoDataScreen from '../NoDataScreen'
import CSVSlide from '../Slides/CSVSlide'

interface ProductDisplayProps {
    sources: ProductType[]
    loading: boolean
    onIndexChange: (index: number) => void
}

function ProductDisplay({ sources, loading, onIndexChange }: ProductDisplayProps) 
{
    const servicePerformanceMode = useAppSelector(state => state.services.performanceMode)

    const [currentIndex, setCurrentIndex] = useState(0)
    const [inputValue, setInputValue] = useState(currentIndex + 1)

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
    })

    const goToPrev = () => emblaApi?.scrollPrev()
    const goToNext = () => emblaApi?.scrollNext()

    const goToIndex = (rawValue: string | number) => 
    {
        const value = Number(rawValue)

        if (!emblaApi || Number.isNaN(value)) return

        const index = value - 1

        const safeIndex = Math.max(
            0,
            Math.min(index, sources.length - 1)
        )

        emblaApi.scrollTo(safeIndex)
    }

    const handleChange = ( { target: { value } }: ChangeEvent<HTMLInputElement> ) =>
    {
        const index = Number(value)

        if (Number.isNaN(index))
        {
            setInputValue(currentIndex)
            return
        }

        setInputValue(index)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        goToIndex(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => 
    {
        if (e.key !== 'Enter') return

        goToIndex(e.currentTarget.value)
    }

    useEffect(() => {

        if (!emblaApi) return

        const onSelect = () => {
            const index = emblaApi.selectedScrollSnap()
            setCurrentIndex(index)
            onIndexChange(index)
        }

        onSelect()

        emblaApi.on('select', onSelect)

        return () => {
            emblaApi.off('select', onSelect)
        }

    }, [emblaApi])

    useEffect(() => {
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setInputValue(currentIndex + 1)
    }, [currentIndex])

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
            <NoDataScreen/>
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

                            if(source.metadata?.extension?.toLowerCase() === "html")
                            {
                                return (
                                    <HtmlSlide

                                        key={key}
                                        filename={source.name}
                                        performance={servicePerformanceMode}
                                        extension={source.metadata.extension}
                                        src={src}
                                    />
                                )
                            }

                            if(source.metadata?.extension?.toLowerCase() === "csv")
                            {
                                return (
                                    <CSVSlide
                                        key={key}
                                        filename={source.name}
                                        performance={servicePerformanceMode}
                                        extension={source.metadata.extension}
                                        src={src}
                                    />
                                )
                            }

                            return (
                                <ImageSlide
                                    key={key}
                                    filename={source.name}
                                    alt={source.product_id}
                                    src={src}
                                    extension={source.metadata?.extension}
                                />
                            )
                        })
                    }
                    
                </div>
            </div>

            <div className='absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-white px-4 py-2 shadow'>
                <input style={{ width: `${String(inputValue).length + 1}ch` }}
                       size={String(inputValue).length}
                       onKeyDown={handleKeyDown}
                       onChange={handleChange}
                       onBlur={handleBlur} 
                       value={inputValue}/>
                <span className='font-bold'>
                    / {sources.length}
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

export default ProductDisplay