import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import { CiGrid41 } from 'react-icons/ci'
import { TfiViewListAlt } from 'react-icons/tfi'
import ServiceCardGrid from './Service/ServiceCardGrid'
import ServiceCardList from './Service/ServiceCardList'
import { CgPerformance } from 'react-icons/cg'
import { setServicePerfomanceMode } from '@/lib/features/services/servicesSlice'
import { showSnackbar } from '@/lib/features/snackbar/snackbarSlice'


function ServicesDisplay() 
{
    const dispatch = useAppDispatch()
    
    const servicesData = useAppSelector(state => state.services.data)
    const fetched = useAppSelector(state => state.services.fetched)
    const servicePerformanceMode = useAppSelector(state => state.services.performanceMode)

    const [presentation, setPresentation] = useState<string>("grid")

    const handlePresentationChange = (event: React.MouseEvent<HTMLElement>, newPresentation: string) => 
    {
        if(newPresentation != null)
        {
            setPresentation(newPresentation)
        }
    };

    const handleServicePerformanceModeClick = () => 
    {
        if(servicePerformanceMode === true)
        {
            dispatch(showSnackbar({
                message: "Desactivar el modo rendimiento puede causar cierres inesperados o lentitud en equipos con pocos recursos.",
                severity: "warning",
                autoHideDuration: 5000,
                anchorOrigin: {
                    "vertical": "bottom",
                    "horizontal": "center"
                }
            }))
        }

        dispatch(setServicePerfomanceMode(!servicePerformanceMode));
    };

    return (
        <div className="my-18 max-md:my-10">
        

        <div className="flex items-center justify-between">

            { fetched ? 
                <label className="font-bold text-[#757575]">
                    {servicesData.length} servicios encontrados
                </label>
                :
                <div className='font-bold text-[#757575] max-md:max-w-[180px]'>Realice una búsqueda para mostrar servicios</div>
            }
            
            <div>
                <ToggleButtonGroup
                exclusive
                value={presentation}
                onChange={handlePresentationChange}
                >
                    <Tooltip title="Vista en tabla">
                        <ToggleButton value={"grid"}>
                            <CiGrid41 size={20}/>
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip title="Vista en lista">
                        <ToggleButton value={"list"}>
                            <TfiViewListAlt size={20}/>
                        </ToggleButton>
                    </Tooltip>
                </ToggleButtonGroup>

                <ToggleButtonGroup value={servicePerformanceMode}>
                    <Tooltip title="Modo rendimiento">
                        <ToggleButton onClick={handleServicePerformanceModeClick} value={true}>
                            <CgPerformance size={20}/>
                        </ToggleButton>
                    </Tooltip>
                </ToggleButtonGroup>
            </div>
            
            </div>

            <hr className="border-[#cfcfcf] my-4"/>

            <div className="flex flex-wrap justify-center gap-2">
            { presentation === "grid" ?
                servicesData.map(service => <ServiceCardGrid key={service.service_id} service={service}/>)
                :
                <div className="w-full flex flex-col gap-1">
                    {servicesData.map(service => <ServiceCardList key={service.service_id} service={service}/>)}
                </div>
            }
            </div>
        </div>
    )
}

export default ServicesDisplay