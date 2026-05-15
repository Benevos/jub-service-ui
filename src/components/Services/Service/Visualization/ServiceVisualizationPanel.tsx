'use client'

import { TabPanel } from '@mui/lab'
import { useEffect, useState } from 'react'
import ServiceCarouselSink from './ServiceCarouselSink'
import { useAppSelector } from '@/lib/hooks'
import ServiceCarouselRandom from './ServiceCarouselRandom'
import ProductType from '@/types/products'
import ServiceCarouselSource from './ServiceCarouselSource'
import { DataSourceType } from '@/types/datasource'
import { IconButton, Tooltip } from '@mui/material'
import { LuRefreshCcw } from 'react-icons/lu'
import { useDispatch } from 'react-redux'
import { showSnackbar } from '@/lib/features/snackbar/snackbarSlice'

interface RandomImage {
    id: number
    url: string
}

function ServiceVisualizationPanel() 
{
    
    const dispatch = useDispatch()

    const coincidentObservatoriesDetails = useAppSelector(state => state.observatories.coincidentDetails)

    const [source, setSource] = useState<DataSourceType[]>([])
    const [loadingSource, setLoadingSource] = useState<boolean>(false)
    
    const [sinks, setSinks] = useState<ProductType[]>([])
    const [loadingSinks, setLoadingSinks] = useState<boolean>(false)


    const fetchServiceSource = async () =>
    {
        //console.log("FETCH")
   
        if(coincidentObservatoriesDetails.length < 1) 
        {
            setSource([])
            return
        }
        

        //TODO: Esto no deberia ser un arreglo, arreglen JUB
        const coincidentObservatory = coincidentObservatoriesDetails[0]


        if(!coincidentObservatory.data_sources)
        {
            setSource([])
            return
        }

        if(!coincidentObservatory.data_sources[0])
        {
            setSource([])
            return
        }

        const datasource = coincidentObservatory.data_sources[0]

        
        setLoadingSource(true)
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
                limit: 25,
            }),
        })

        const data = await response.json()

        //("SOURCE")
        setSource(data)
        setLoadingSource(false)
    }

    const fetchServiceSink = async () => 
    {

        if(coincidentObservatoriesDetails.length < 1) 
        {
            setSinks([])
            return
        }

        //TODO: Esto no deberia ser un arreglo, arreglen JUB
        const coincidentObservatory = coincidentObservatoriesDetails[0]

      
        setLoadingSinks(true)

        try 
        {
            const response = await fetch(
                "https://apix.tamps.cinvestav.mx/jub/api/v2/search",
                {
                    cache: "no-store",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    observatory_id: coincidentObservatory.observatory_id,
                    query: "jub.v1.VS(*).VT(*).VI(*)",
                    limit: 24,
                    skip: 0,
                    strict: false
                }),
                }
            )

            if(!response.ok)
            {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();

            setSinks(data)
        }
        catch(error)
        {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error inesperado";
            
            dispatch(showSnackbar({
                message: errorMessage,
                severity: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "center"
                }
            }));
        }
        finally
        {
            setLoadingSinks(false)    
        }
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
                </div>

                <ServiceCarouselSource source={source} loading={loadingSource}/>

                <div className='flex items-center justify-center text-lg font-bold p-4 bg-[#e6e6e6]'>
                    <span>Productos</span>
                </div>

                <ServiceCarouselSink sources={sinks} loading={loadingSinks}/>

            </div>

        </TabPanel>
    )
}

export default ServiceVisualizationPanel