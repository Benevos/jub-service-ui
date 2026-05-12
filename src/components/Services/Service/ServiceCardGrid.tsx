import React from 'react'

import ServiceType from '@/types/service'
import { Card, CardActionArea } from '@mui/material'
import { BsBarChartSteps } from 'react-icons/bs'
import { GoGear } from 'react-icons/go'
import { LuWorkflow } from 'react-icons/lu'
import { MdLockOutline, MdPublic } from 'react-icons/md'
import { useAppDispatch } from '@/lib/hooks'
import { setOpenService, setSelectedService } from '@/lib/features/services/servicesSlice'

type ServiceCardGridProps = {
  service: ServiceType;
};

function ServiceCardGrid({ service }: ServiceCardGridProps) 
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
    <div className="w-full max-w-[470px] form-shadow rounded-[40px]">
      <Card
        sx={{
          borderRadius: 5,
          height: "100%"
        }}
      >
        <CardActionArea onClick={handleClick}>
        
            <div className="p-5 flex flex-col">
              <div className="flex justify-between items-center">
                <div className="bg-[#e6e6e6] text-black flex justify-center items-center w-10 h-10 rounded-lg">
                  <GoGear size={30}/>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#e6e6e6] rounded-md flex items-center justify-center
                                        font-bold text-sm h-8 px-2">
                      {service.provider === "OTHER" ? "OTRO" : service.provider === "EXTERNAL" ? "EXTERNO" : service.provider}
                    </span>

                    <div className="flex items-center bg-[#e6e6e6] rounded-md font-bold h-8 px-2">
                      {service.public ? <MdPublic/>  : <MdLockOutline/>} 
                      <span className="ml-1 font-sm">{service.public ? "Público" : "Privado"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <span className="font-bold text-xl">{service.name}</span>
            </div>
      
            <hr className="border-[#757575] border-1"/>

            <div className="p-5">
              <p>{service.description}</p>
            </div>

            <hr className="border-[#cfcfcf]"/>

            <div className="p-4 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <LuWorkflow/> <span className="text-sm">{service.workflow.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <BsBarChartSteps/> 
                <span className="text-sm">
                  {`${service.workflow.stages.length} ${service.workflow.stages.length === 1 ? "Etapa" : "Etapas"}`}
                </span>
              </div>
            </div>
        </CardActionArea>
      </Card>
    </div>
  )
}

export default ServiceCardGrid