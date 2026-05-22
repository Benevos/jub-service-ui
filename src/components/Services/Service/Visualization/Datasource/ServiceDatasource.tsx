import { IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FiFilePlus } from 'react-icons/fi'
import { LuFileDown } from 'react-icons/lu'
import DatasourceDisplay from './DatasourceDisplay'
import ProductDisplay from '../Sink/ProductDisplay'
import { DataSourceType } from '@/types/datasource'
import ProductType from '@/types/products'
import { useAppRequiredAuth, useAppSelector } from '@/lib/hooks'
import { useDispatch } from 'react-redux'
import { ObservatoryDetailsType } from '@/types/observatory'
import { showSnackbar } from '@/lib/features/snackbar/snackbarSlice'
import axios, { AxiosProgressEvent } from 'axios'

function ServiceDatasource() 
{
    const PAGE_SIZE = 10

    const dispatch = useDispatch()

    const coincidentObservatoriesDetails = useAppSelector(state => state.observatories.coincidentDetails)
    const observatories = useAppSelector(state => state.observatories.data)

    const auth = useAppRequiredAuth()

    const [datasource, setDatasource] = useState<DataSourceType[] | ProductType[]>([])
    const [loadingDatasource, setLoadingDatasource] = useState<boolean>(false)
    const [datasourceSkip, setDatasourceSkip] = useState(0)

    const [currentProductIndex, setCurrentProductIndex] = useState(0)

    const [progress, setProgress] = useState(0)
    const [downloading, setDownloading] = useState(false)
    const [error, setError] = useState(false);

    const fetchServiceDatasource = async (
        skip = 0,
        append = false
    ) =>
    {
   
        if(coincidentObservatoriesDetails.length < 1) 
        {
            setDatasource([])
            return
        }

        try
        {
            setLoadingDatasource(true)

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
                    setDatasource(prev => [...prev, ...merged])
                }
                else
                {
                    setDatasource(merged)
                }
                return
            }


            //TODO: Esto no deberia ser un arreglo, arreglen JUB
            const coincidentObservatory = coincidentObservatoriesDetails[0]


            if(!coincidentObservatory.data_sources || !coincidentObservatory.data_sources[0])
            {
                setDatasource([])
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
                    "Authorization": `Bearer ${auth.access_token}`,
                    "Temporal-Secret-Key": auth.temporal_secret_key,
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
                setDatasource(prev => [...prev, ...data])
            }
            else
            {
                setDatasource(data)
            }
        }
        catch(error)
        {
            //TODO: dispatch snackbar
            console.error(error)
        }
        finally
        {
            setLoadingDatasource(false)
        }
    }

    const handleLoadMore = () => {
        const nextSkip = datasourceSkip + PAGE_SIZE

        setDatasourceSkip(nextSkip)

        fetchServiceDatasource(nextSkip, true)
    }

    const handleDownload = async () =>
    {
        if(isDataSourceArray(datasource))
        {
            try
            {
                dispatch(showSnackbar({
                    severity: "info",
                    message: `Descargando.`,
                    anchorOrigin: {
                        horizontal: "center",
                        vertical: "bottom"
                    }
                }))

                const json = JSON.stringify(datasource, null, 2)

                const blob = new Blob([json], { type: "application/json" })
                const url = URL.createObjectURL(blob)

                const a = document.createElement("a")
                a.href = url
                a.download = datasource[0].source_id ? datasource[0].source_id : "fuente_de_datos"
                a.click()

                URL.revokeObjectURL(url)

                dispatch(showSnackbar({
                    severity: "success",
                    message: `Descarga completada.`,
                    anchorOrigin: {
                        horizontal: "center",
                        vertical: "bottom"
                    }
                }))
            }
            catch(error)
            {               
                dispatch(showSnackbar({
                    severity: "error",
                    message: 'Error al descargar archivo.',
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "center"
                    }
                }))
            }
            
            return
        }
        
        try
        {
            setDownloading(true)
            setProgress(0)

            const product = datasource[currentProductIndex]

            if (!product) return

            dispatch(showSnackbar({
                severity: "info",
                message: `Descargando.`,
                anchorOrigin: {
                    horizontal: "center",
                    vertical: "bottom"
                }
            }))

            const src = `https://apix.tamps.cinvestav.mx/jub/api/v2/products/${product.product_id}/download`

            const response = await axios.get(src, {
                responseType: 'blob',

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

            const blob = response.data

            const url = window.URL.createObjectURL(blob)

            const a = document.createElement('a')

            a.href = url
            a.download = product.name ? product.name : 'archivo'

            document.body.appendChild(a)

            a.click()

            a.remove()

            window.URL.revokeObjectURL(url)

            setProgress(100)

            dispatch(showSnackbar({
                severity: "success",
                message: `Descarga completada.`,
                anchorOrigin: {
                    horizontal: "center",
                    vertical: "bottom"
                }
            }))
        }
        catch(error)
        {
            setError(true)

            let errorMessage = 'Error al descargar archivo.'

            if (axios.isAxiosError(error))
            {
                if (error.response?.status === 404)
                {
                    errorMessage = 'Archivo no encontrado o inexistente.'
                }

                else if (error.code === "ERR_NETWORK")
                {
                    errorMessage = 'Error de red o posible problema de CORS.'
                }

                errorMessage = `(${error.response?.status}) ${errorMessage}`
            }

            dispatch(showSnackbar({
                severity: "error",
                message: errorMessage,
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "center"
                }
            }))
        }
        finally
        {
            // Espera pequeña para que el usuario vea el 100%
            setTimeout(() =>
            {
                

                setError(false)
                setDownloading(false)
                setProgress(0)
            }, 800)
        }
    }

    const isDataSourceArray = (
            data: DataSourceType[] | ProductType[]
        ): data is DataSourceType[] => {
            return data.length > 0 && "record_id" in data[0]
        }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchServiceDatasource()
    }, [])
    
    return (
        <div>
            <div className='flex items-center justify-center text-lg font-bold p-4 bg-[#e6e6e6]'>
                <span>Fuentes de datos</span>

                <div className='rounded-full button-shadow ml-4'>
                    <Tooltip title="Cargar más">
                        <IconButton disabled={loadingDatasource} onClick={handleLoadMore}>
                            <FiFilePlus/>
                        </IconButton>
                    </Tooltip>
                </div>

                <div className='rounded-full button-shadow ml-4'>

                    <Tooltip title="Descargar">
                        <IconButton onClick={handleDownload} disabled={loadingDatasource}>
                            <LuFileDown/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            {
                isDataSourceArray(datasource) ?
                    <DatasourceDisplay source={datasource} loading={loadingDatasource}/>
                :
                    <ProductDisplay sources={datasource} loading={loadingDatasource} onIndexChange={setCurrentProductIndex}/>
            }
        </div>
    )
}

export default ServiceDatasource