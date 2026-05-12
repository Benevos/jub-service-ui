"use client";

import { setOpenService } from '@/lib/features/services/servicesSlice';

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { TabContext, TabList} from '@mui/lab';
import { Dialog, IconButton, Tab, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import ServiceDetailsPanel from './ServiceDetailsPanel';
import ServiceVisualizationPanel from './Visualization/ServiceVisualizationPanel';

function ServiceOverview() 
{
    const dispatch = useAppDispatch()
    const selectedService = useAppSelector(state => state.services.selected)
    const openService = useAppSelector(state => state.services.open)
    
    const [currentTab, setCurrentTab] = useState("1")

    const theme = useTheme();
    const isOnMoblieSize = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => 
    {
        dispatch(setOpenService(false))
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => 
    {
        setCurrentTab(newValue);
    };

    if (!selectedService) return null;

    return (
        <Dialog
            maxWidth={"lg"}
            fullWidth={!isOnMoblieSize}
            fullScreen={isOnMoblieSize}
            onClose={handleClose} 
            open={openService}>
            <div className='bg-white'>
                <div className='bg-[#cfcfcf] px-4 py-2 flex items-center justify-between gap-4'>
                    <span className='text-xl font-bold'>{selectedService.name}</span>
                    
                    <Tooltip title={"Cerrar"}>
                        <IconButton onClick={handleClose}>
                            <RxCross2/>
                        </IconButton>
                    </Tooltip>
                
                </div>
                <div className='bg-[#e6e6e6] px-4 py-2'>
                    <span>{selectedService.description}</span>
                </div>
                <hr className='border-[#cfcfcf]'/>

                <div>
                    <TabContext value={currentTab}>
                        <div>
                            <TabList variant='fullWidth' onChange={handleChange}>
                                <Tab value={"1"} label="Detalles"/>
                                <Tab value={"2"} label="Visualización"/>
                            </TabList>
                        </div>
            
                        <ServiceDetailsPanel/>

                        <ServiceVisualizationPanel/>
                    </TabContext>
                </div>
            </div>
        </Dialog>
    )
}

export default ServiceOverview