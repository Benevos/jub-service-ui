"use client";

import { IconButton, Tooltip } from '@mui/material';
import ProductDisplay from './ProductDisplay'
import { LuFileDown, LuFilePlus } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppRequiredAuth, useAppSelector } from '@/lib/hooks';
import ProductType from '@/types/products';
import { ObservatoryDetailsType } from '@/types/observatory';
import axios, { AxiosProgressEvent } from 'axios';
import { showSnackbar } from '@/lib/features/snackbar/snackbarSlice';

function ServiceProducts() 
{
    const PAGE_SIZE = 10

    const dispatch = useAppDispatch()

    const coincidentObservatoriesDetails = useAppSelector(state => state.observatories.coincidentDetails)
    const observatories = useAppSelector(state => state.observatories.data)

    const auth = useAppRequiredAuth()

    const [products, setProducts] = useState<ProductType[]>([])
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false)
    const [productSkip, setProductSkip] = useState(0)

    const [currentProductIndex, setCurrentProductIndex] = useState(0)
    const currentProduct = products[currentProductIndex]

    const [progress, setProgress] = useState(0)
    const [downloading, setDownloading] = useState(false)
    const [error, setError] = useState(false);

    const fetchServiceProducts = async (
        skip = 0,
        append = false
    ) => 
    {

        if(coincidentObservatoriesDetails.length < 1) 
        {
            setProducts([])
            return
        }

        try
        {
            setLoadingProducts(true)

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
                    setProducts(prev => [...prev, ...merged])
                }
                else
                {
                    setProducts(merged)
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
                setProducts(prev => [...prev, ...merged])
            }
            else
            {
                setProducts(merged)
            }
        }
        catch(error)
        {
            //TODO: dispatch snackbar
            console.error(error)
        }
        finally
        {
            setLoadingProducts(false)
        }
    }

    const handleLoadMore = () => {
        const nextSkip = productSkip + PAGE_SIZE

        setProductSkip(nextSkip)

        fetchServiceProducts(nextSkip, true)
    }

    const handleDownload = async () =>
    {
        try
        {
            setDownloading(true)
            setProgress(0)


            const product = products[currentProductIndex]

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

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchServiceProducts()
    }, [])

    return (
        <div>
            <div className='flex items-center justify-center text-lg font-bold p-4 bg-[#e6e6e6]'>
                <span>Productos</span>

                <div className='rounded-full button-shadow ml-4'>
                    <Tooltip title="Cargar más">
                        <IconButton disabled={loadingProducts} onClick={handleLoadMore}>
                            <LuFilePlus/>
                        </IconButton>
                    </Tooltip>
                </div>

                <div className='rounded-full button-shadow ml-4'>

                    <Tooltip title="Descargar">
                        <IconButton onClick={handleDownload} disabled={loadingProducts}>
                            <LuFileDown/>
                        </IconButton>
                    </Tooltip>
                </div>
                
            </div>

            <ProductDisplay sources={products} loading={loadingProducts} onIndexChange={setCurrentProductIndex}/>
        </div>
    )
}

export default ServiceProducts