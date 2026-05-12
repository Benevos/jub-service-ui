'use client'

import { TabPanel } from '@mui/lab'
import { useEffect, useState } from 'react'
import ServiceCarouselSink from './ServiceCarouselSink'
import { useAppSelector } from '@/lib/hooks'
import ServiceCarouselRandom from './ServiceCarouselRandom'
import ProductType from '@/types/products'
import ServiceCarouselSource from './ServiceCarouselSource'
import { DataSourceType } from '@/types/datasource'

interface RandomImage {
    id: number
    url: string
}

function ServiceVisualizationPanel() 
{
    
    const coincidentObservatoriesDetails = useAppSelector(state => state.observatories.coincidentDetails)

    const [source, setSource] = useState<DataSourceType[]>([])
    const [sinks, setSinks] = useState<ProductType[]>([])

    const [randomTwo, setRandomTwo] = useState<RandomImage[]>([])
    
    const generateRandomImages = (): RandomImage[] => {

        const formats = ['jpg', 'webp']

        return Array.from({ length: 10 }, (_, index) => {

            const width =
                Math.floor(Math.random() * (2000 - 100 + 1)) + 100

            const height =
                Math.floor(Math.random() * (2000 - 100 + 1)) + 100

            const format =
                formats[Math.floor(Math.random() * formats.length)]

            return {
                id: index,

                url: `https://picsum.photos/${width}/${height}.${format}`
            }
        })
    }

    const fetchServiceSource = async () =>
    {
        console.log("FETCH")
   
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

        console.log(datasource)

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
                limit: 25
            }),
        })

        const data = await response.json()

        console.log("SOURCE")
        setSource(data)
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
            limit: 10
          }),
        }
      )

      const data = await response.json();

      console.log("SINKS")
      console.log(data)
      setSinks(data)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchServiceSource()
        fetchServiceSink()
        setRandomTwo(generateRandomImages())
    }, [])


    return (
        <TabPanel sx={{ padding: 0 }} value={"2"}>

            <div>

                <div className='flex items-center justify-center text-lg font-bold p-4 bg-[#e6e6e6]'>
                    <span>Fuente de datos</span>
                </div>

                <ServiceCarouselSource source={source}/>

                <div className='flex items-center justify-center text-lg font-bold p-4 bg-[#e6e6e6]'>
                    <span>Producto</span>
                </div>

                <ServiceCarouselSink sources={sinks}/>

            </div>

        </TabPanel>
    )
}

export default ServiceVisualizationPanel