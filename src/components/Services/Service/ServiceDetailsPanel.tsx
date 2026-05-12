import { useAppSelector } from '@/lib/hooks'
import { TabPanel } from '@mui/lab'
import { LuWorkflow } from 'react-icons/lu'
import { MdLockOutline, MdPublic } from 'react-icons/md'
import StagesGraph from "@/components/Services/StagesGraph"

function ServiceDetailsPanel() 
{
    const selectedService = useAppSelector(state => state.services.selected)

    if (!selectedService) return null;

    return (
        <TabPanel sx={{padding: 0}} value={"1"}>
            <div className='p-4'>

                <div className='flex items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-[#e6e6e6] w-12 h-12 flex items-center justify-center rounded-md'>
                            <LuWorkflow size={30}/>
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-bold text-lg'>{selectedService.workflow.name}</span>
                            <span>{selectedService.workflow.workflow_id}</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-[#e6e6e6] rounded-md flex items-center justify-center
                                                font-bold text-sm h-8 px-2">
                                {selectedService.provider === "OTHER" ? "OTRO" : selectedService.provider === "EXTERNAL" ? "EXTERNO" : selectedService.provider}
                            </span>
        
                            <div className="flex items-center bg-[#e6e6e6] rounded-md font-bold h-8 px-2">
                                {selectedService.public ? <MdPublic/>  : <MdLockOutline/>} 
                                <span className="ml-1 font-sm">
                                    {selectedService.public ? "Público" : "Privado"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className='border-[#cfcfcf]'/>

                <div className='flex items-center justify-center'>
                    <StagesGraph/>
                </div>
            </div>
        </TabPanel>
    )
}

export default ServiceDetailsPanel