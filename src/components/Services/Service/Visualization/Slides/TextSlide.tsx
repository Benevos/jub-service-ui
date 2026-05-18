"use client"

import React, { useEffect, useState } from 'react'
import PerformanceSlide from './PerformanceSlide'
import axios, { AxiosProgressEvent } from 'axios'
import LoadingSlide from './LoadingSlide'

interface TextSlideProps {
    src: string
    filename?: string
    performance?: boolean
}

function TextSlide({
    src,
    filename,
    performance = false
}: TextSlideProps)
{
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    const [textContent, setTextContent] = useState("")

    useEffect(() =>
    {
        if (performance) return

        const controller = new AbortController()

        const loadText = async () =>
        {
            try
            {
                setLoading(true)
                setProgress(0)

                const response = await axios.get(src, {
                    responseType: "blob",
                    signal: controller.signal,

                    onDownloadProgress: (progressEvent: AxiosProgressEvent) =>
                    {
                        if (!progressEvent.total) return

                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )

                        setProgress(percent)
                    }
                })

                const blob: Blob = response.data

                const text = await blob.text()

                setTextContent(text)

                setProgress(100)
            }
            catch(error)
            {
                if (!axios.isCancel(error))
                {
                    console.log(error)
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

        loadText()

        return () =>
        {
            controller.abort()
        }

    }, [src, performance])

    if (performance)
    {
        return (
            <PerformanceSlide
                href={src}
                filename={filename}
            />
        )
    }

    if (loading)
    {
        return (
            <LoadingSlide progress={progress}/>
        )
    }

    return (
        <div className='embla__slide h-full w-full overflow-auto bg-black p-4'>
            <pre className='text-white whitespace-pre-wrap break-words font-mono text-sm'>
                {textContent}
            </pre>
        </div>
    )
}

export default TextSlide