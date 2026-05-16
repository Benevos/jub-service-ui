'use client'

import { TabPanel } from '@mui/lab'
import { useEffect, useState } from 'react'
import ServiceCarouselSink from './ServiceCarouselSink'
import { useAppRequiredAuth, useAppSelector } from '@/lib/hooks'
import ProductType from '@/types/products'
import ServiceCarouselStructuredSource from './ServiceCarouselStructuredSource'
import { DataSourceType } from '@/types/datasource'
import { useDispatch } from 'react-redux'
import { FiFilePlus } from "react-icons/fi";
import { ObservatoryDetailsType } from '@/types/observatory'
import { IconButton, Tooltip } from '@mui/material'

function ServiceVisualizationPanel() 
{
    
    const dispatch = useDispatch()

    const coincidentObservatoriesDetails = useAppSelector(state => state.observatories.coincidentDetails)
    const observatories = useAppSelector(state => state.observatories.data)

    const PAGE_SIZE = 10

    const [sourceSkip, setSourceSkip] = useState(0)
    const [sinkSkip, setSinkSkip] = useState(0)

    const auth = useAppRequiredAuth()

    const [source, setSource] = useState<DataSourceType[] | ProductType[]>([])
    const [loadingSource, setLoadingSource] = useState<boolean>(false)
    
    const [sinks, setSinks] = useState<ProductType[]>([])
    const [loadingSinks, setLoadingSinks] = useState<boolean>(false)
    
    const fetchServiceSource = async (
        skip = 0,
        append = false
    ) =>
    {
   
        if(coincidentObservatoriesDetails.length < 1) 
        {
            setSource([])
            return
        }

        try
        {
            setLoadingSource(true)

            const sinkObservatoriesDetails: ObservatoryDetailsType[] = []
            const datasourceObservatoriesDetails: ObservatoryDetailsType[] = []
            const unknownObservatoriesDetails: ObservatoryDetailsType[] = []

            for (const details of coincidentObservatoriesDetails)
            {
                const observatory = observatories.find(
                    observatory =>
                        observatory.observatory_id === details.observatory_id
                )

                switch (observatory?.metadata?.type)
                {
                    case "sink":
                        sinkObservatoriesDetails.push(details)
                        break

                    case "datasource":
                        datasourceObservatoriesDetails.push(details)
                        break

                    default:
                        unknownObservatoriesDetails.push(details)
                }
            }

            if(datasourceObservatoriesDetails && datasourceObservatoriesDetails.length > 0)
            {
                const responses = await Promise.all(
                    datasourceObservatoriesDetails.map(async datasourceObservatory => {
                        const response = await fetch(
                            "https://apix.tamps.cinvestav.mx/jub/api/v2/search",
                            {
                                cache: "no-store",
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${auth.access_token}`,
                                    "Temporal-Secret-Key": auth.temporal_secret_key,
                                },
                                body: JSON.stringify({
                                    observatory_id: datasourceObservatory.observatory_id,
                                    query: "jub.v1.VS(*).VT(*).VI(*)",
                                    limit: 10,
                                    skip,
                                    strict: false
                                }),
                            }
                        )

                        if(!response.ok)
                        {
                            throw new Error("Error al obtener fuentes de datos")
                        }

                        return response.json()
                    })
                )

                console.log(responses.flat())

                const merged = responses.flat()

                if (append)
                {
                    setSource(prev => [...prev, ...merged])
                }
                else
                {
                    setSource(merged)
                }
                return
            }


            //TODO: Esto no deberia ser un arreglo, arreglen JUB
            const coincidentObservatory = coincidentObservatoriesDetails[0]


            if(!coincidentObservatory.data_sources || !coincidentObservatory.data_sources[0])
            {
                setSource([])
                return
            }

            const datasource = coincidentObservatory.data_sources[0]

            const response = await fetch(
            `https://apix.tamps.cinvestav.mx/jub/api/v2/datasources/${datasource.source_id}/query`,
            {
                cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    observatory_id: coincidentObservatory,
                    query: "jub.v1.VS(*).VT(*).VI(*)",
                    skip,
                    limit: 10,
                }),
            })

            if(!response.ok)
            {
                throw new Error("Error al obtener fuentes de datos")
            }

            const data = await response.json()

            if (append)
            {
                setSource(prev => [...prev, ...data])
            }
            else
            {
                setSource(data)
            }
        }
        catch(error)
        {
            //TODO: dispatch snackbar
            console.error(error)
        }
        finally
        {
            setLoadingSource(false)
        }
    }

    const fetchServiceSink = async (
        skip = 0,
        append = false
    ) => 
    {

        if(coincidentObservatoriesDetails.length < 1) 
        {
            setSinks([])
            return
        }

        try
        {
            setLoadingSinks(true)

            const sinkObservatoriesDetails: ObservatoryDetailsType[] = []
            const datasourceObservatoriesDetails: ObservatoryDetailsType[] = []
            const unknownObservatoriesDetails: ObservatoryDetailsType[] = []

            for (const details of coincidentObservatoriesDetails)
            {
                const observatory = observatories.find(
                    observatory =>
                        observatory.observatory_id === details.observatory_id
                )

                switch (observatory?.metadata?.type)
                {
                    case "sink":
                        sinkObservatoriesDetails.push(details)
                        break

                    case "datasource":
                        datasourceObservatoriesDetails.push(details)
                        break

                    default:
                        unknownObservatoriesDetails.push(details)
                }
            }

            if(sinkObservatoriesDetails && sinkObservatoriesDetails.length > 0)
            {
                const responses = await Promise.all(
                    sinkObservatoriesDetails.map(async sinkObservatory => {
                            const response = await fetch(
                            "https://apix.tamps.cinvestav.mx/jub/api/v2/search",
                            {
                                cache: "no-store",
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${auth.access_token}`,
                                    "Temporal-Secret-Key": auth.temporal_secret_key,
                                },
                                body: JSON.stringify({
                                    observatory_id: sinkObservatory.observatory_id,
                                    query: "jub.v1.VS(*).VT(*).VI(*)",
                                    limit: 10,
                                    skip,
                                    strict: false
                                }),
                            }
                        )

                        if(!response.ok)
                        {
                            throw new Error("Error al obtener productos")
                        }

                        return response.json()
                    })
                )

                const merged = responses.flat()

                if (append)
                {
                    setSinks(prev => [...prev, ...merged])
                }
                else
                {
                    setSinks(merged)
                }
                return
            }

            const responses = await Promise.all(
                unknownObservatoriesDetails.map(async unknownObservatory => {
                        const response = await fetch(
                        "https://apix.tamps.cinvestav.mx/jub/api/v2/search",
                        {
                            cache: "no-store",
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${auth.access_token}`,
                                "Temporal-Secret-Key": auth.temporal_secret_key,
                            },
                            body: JSON.stringify({
                                observatory_id: unknownObservatory.observatory_id,
                                query: "jub.v1.VS(*).VT(*).VI(*)",
                                limit: 10,
                                skip: 0,
                                strict: false
                            }),
                        }
                    )

                    if(!response.ok)
                    {
                        throw new Error("Error al obtener productos")
                    }

                    return response.json()
                })
            )

            const merged = responses.flat()

            if (append)
            {
                setSinks(prev => [...prev, ...merged])
            }
            else
            {
                setSinks(merged)
            }
        }
        catch(error)
        {
            //TODO: dispatch snackbar
            console.error(error)
        }
        finally
        {
            setLoadingSinks(false)
        }
    }

    const handleLoadMoreSource = () => {
        const nextSkip = sourceSkip + PAGE_SIZE

        setSourceSkip(nextSkip)

        fetchServiceSource(nextSkip, true)
    }

    const handleLoadMoreSinks = () => {
        const nextSkip = sinkSkip + PAGE_SIZE

        setSinkSkip(nextSkip)

        fetchServiceSink(nextSkip, true)
    }

    const isDataSourceArray = (
        data: DataSourceType[] | ProductType[]
    ): data is DataSourceType[] => {
        return data.length > 0 && "record_id" in data[0]
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchServiceSource()
        fetchServiceSink()
    }, [])


    return (
        <TabPanel sx={{ padding: 0 }} value={"2"}>

            <div>

                <div className='flex items-center justify-center text-lg font-bold p-4 bg-[#e6e6e6]'>
                    <span>Fuentes de datos</span>

                    <div className='rounded-full button-shadow ml-4'>
                        <Tooltip title="Cargar más">
                            <IconButton disabled={loadingSource} onClick={handleLoadMoreSource}>
                                <FiFilePlus/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>

                {
                    isDataSourceArray(source) ?
                        <ServiceCarouselStructuredSource source={source} loading={loadingSource}/>
                    :
                        <ServiceCarouselSink sources={source} loading={loadingSource}/>
                }
                

                <div className='flex items-center justify-center text-lg font-bold p-4 bg-[#e6e6e6]'>
                    <span>Productos</span>

                    <div className='rounded-full button-shadow ml-4'>
                        <Tooltip title="Cargar más">
                            <IconButton disabled={loadingSinks} onClick={handleLoadMoreSinks}>
                                <FiFilePlus/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    
                </div>

                <ServiceCarouselSink sources={sinks} loading={loadingSinks}/>

            </div>

        </TabPanel>
    )
}

export default ServiceVisualizationPanel