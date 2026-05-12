import { setOpenService, setSelectedService } from '@/lib/features/services/servicesSlice';
import { useAppDispatch } from '@/lib/hooks';
import ServiceType from '@/types/service';
import { Card, CardActionArea } from '@mui/material';
import React from 'react'
import { BsBarChartSteps } from 'react-icons/bs';
import { GoGear } from 'react-icons/go';
import { LuWorkflow } from 'react-icons/lu';
import { MdLockOutline, MdPublic } from 'react-icons/md';

type ServiceCardGridProps = {
  service: ServiceType;
};

function ServiceCardList({ service }: ServiceCardGridProps) 
{
    const dispatch = useAppDispatch();
      
    const handleClick = () =>
    {
        console.log("SELECTED SERVICE")
        console.log(service)
        dispatch(setSelectedService(service))
        dispatch(setOpenService(true))
    }

    return (
        <div className='form-shadow'>
            <Card>
                <CardActionArea onClick={handleClick}>
                    <div className='w-full flex p-4 gap-4 items-center'>
                        <div>
                            <div className='bg-[#e6e6e6] h-11 w-11 flex items-center justify-center rounded-md'>
                                <GoGear size={30}/>
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <span className='font-bold'>{service.name}</span>
                            <p className='text-sm'>{service.description}</p>

                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-[#e6e6e6] rounded-md flex items-center justify-center
                                                        font-bold text-xs h-6 px-2">
                                    {service.provider === "OTHER" ? "OTRO" : service.provider === "EXTERNAL" ? "EXTERNO" : service.provider}
                                    </span>

                                    <div className="flex items-center bg-[#e6e6e6] rounded-md font-bold h-6 px-2">
                                        {service.public ? <MdPublic/>  : <MdLockOutline/>}  
                                        <span className="ml-1 text-xs">{service.public ? "Público" : "Privado"}</span>
                                    </div>

                                    <div className="flex items-center bg-[#e6e6e6] rounded-md font-bold h-6 px-2">
                                        <LuWorkflow/> <span className="ml-1 text-xs">{service.workflow.name}</span>
                                    </div>
                                    
                                    <div className="flex items-center bg-[#e6e6e6] rounded-md font-bold h-6 px-2">
                                        <BsBarChartSteps/> 
                                        <span className="ml-1 text-xs">
                                            {`${service.workflow.stages.length} ${service.workflow.stages.length === 1 ? "Etapa" : "Etapas"}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </CardActionArea>
            </Card>
        </div>
    )
}

export default ServiceCardList