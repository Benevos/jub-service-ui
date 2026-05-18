"use client"

import React, { useEffect, useState } from 'react'
import PerformanceSlide from './PerformanceSlide'
import axios, { AxiosProgressEvent } from 'axios'
import LoadingSlide from './LoadingSlide'
import { AllCommunityModule, ColDef } from "ag-grid-community";
import Papa from "papaparse"
import { AgGridProvider, AgGridReact } from 'ag-grid-react'

interface CSVSlideProps {
    src: string
    filename?: string | null | undefined
    performance?: boolean
    extension?: string | null | undefined
}

type CSVRow = Record<string, string | number | boolean>

function CSVSlide({ src, filename, extension, performance=false }: CSVSlideProps)
{
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    const [colDefs, setColDefs] = useState<ColDef[]>([])
    const [rowData, setRowData] = useState<CSVRow[]>([])
    const modules = [AllCommunityModule]

    useEffect(() =>
    {
        if (performance) return

        const controller = new AbortController()

        const loadHtml = async () =>
        {
            try
            {
                setLoading(true)
                setProgress(0)

                const response = await axios.get(src, {
                    responseType: 'blob',
                    signal: controller.signal,

                    onDownloadProgress: (progressEvent: AxiosProgressEvent) =>
                    {
                        // Algunos servidores no envían content-length
                        if (!progressEvent.total) return

                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )

                        setProgress(percent)
                    }
                })

                const blob: Blob = response.data

                const url = URL.createObjectURL(blob)

                setBlobUrl(url)

                const text = await blob.text()

                const parsed = Papa.parse<CSVRow>(text, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true
                }) 

                const columns: ColDef[] = !parsed.meta.fields ? [] : parsed.meta.fields.map(field => ({
                    field: field,
                }))
                
                setColDefs(columns)
                setRowData(parsed.data)

                setProgress(100)
            }
            catch(error)
            {
                if (!axios.isCancel(error))
                {
                    console.log("Petición abortada o error")
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

        loadHtml()

        return () =>
        {
            controller.abort()

            setBlobUrl((prev) =>
            {
                if (prev)
                {
                    URL.revokeObjectURL(prev)
                }

                return null
            })
        }

    }, [src, performance])

    if (performance)
    {
        return <PerformanceSlide href={src} filename={filename} extension={extension}/>
    }

    if (!blobUrl)
    {
        return (
            <LoadingSlide progress={progress}/>
        )
    }

    return (
        <div className='embla__slide h-full text-black'>
            <AgGridProvider modules={modules}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={100}
                    autoSizeStrategy={{
                        type: 'fitGridWidth'
                    }}
                />
            </AgGridProvider>
        </div>
    )
}

export default CSVSlide