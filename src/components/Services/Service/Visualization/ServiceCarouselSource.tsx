import { v4 as uuid } from "uuid"
import { DataSourceType } from '@/types/datasource'
import { IconButton, Tooltip } from "@mui/material";
import { IoIosCopy, IoMdCopy } from "react-icons/io";

interface ServiceCarouselProps {
    source: DataSourceType[]
}

const paginationModel = { page: 0, pageSize: 25 };

function ServiceCarouselSource({ source }: ServiceCarouselProps) 
{
    return (
        <div className="h-[600px] max-md:h-[300px] overflow-x-auto">

            {
                source.length < 1 ? 
                    <div className='w-full h-full bg-black flex items-center justify-center'>
                        <span className='text-white font-bold text-xl'>Sin datos ligados</span>
                    </div>
                :
                    <table className='w-full h-full divide-y border-y border-y-gray-300 divide-gray-300'>
                        <thead>
                            <tr className="table-head bg-gray-200">
                                <th className="table-head-box w-fit">ID REGISTRO</th>
                                <th className="table-head-box w-fit">ESPACIAL (VS)</th>
                                <th className="table-head-box w-fit">TEMPORAL (VT)</th>
                                <th className="table-head-box w-fit">INTERÉS (VI)</th>
                                <th className="table-head-box w-fit">NÚMERICO (VI)</th>
                                <th className="table-head-box w-fit">DETALLES</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            source.map(reg => 
                                <tr key={reg.record_id}>
                                    <td className="table-body-box text-[#757575]">
                                        {reg.record_id}
                                    </td>
                                    <td className="table-body-box">
                                        <div className="bg-[#e6e6e6] text-xs font-bold py-2 px-3 w-fit rounded-4xl">
                                            {reg.spatial_id}
                                        </div>
                                    </td>
                                    <td className="table-body-box text-[#757575]">
                                        {
                                            new Date(reg.temporal_id).toLocaleDateString(
                                                "es-MX",
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric"
                                                }
                                            )
                                        }
                                    </td>
                                    <td className="table-body-box">
                                        {reg.interest_ids.map(interest_id =>
                                            <div key={interest_id}>
                                                {interest_id}
                                            </div>
                                        )}
                                    </td>
                                    <td className="table-body-box max-w-[300px]">
                                        <div className="flex flex-wrap gap-1">
                                        {
                                            Object.entries(reg.numerical_interest_ids).map(
                                                ([key, value]) => (
                                                    <div key={key} className="py-1 px-2 text-[10px] bg-[#e6e6e6] rounded-2xl">
                                                        {`${key.toLocaleUpperCase()}: ${Number(value).toFixed(0)}`}
                                                    </div>
                                                )
                                            )
                                        }
                                        </div>
                                    </td>
                                    <td>
                                        <div className="w-full h-full flex items-center justify-center">
                                            <IconButton>
                                                <Tooltip title="Copiar en texto plano">
                                                    <IoIosCopy size={20} onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            JSON.stringify(reg.raw_payload, null, 2)
                                                        )
                                                    }}/>
                                                </Tooltip>
                                            </IconButton>
                                        </div>
                                        
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                
            }
            
        </div>
    )
}

export default ServiceCarouselSource