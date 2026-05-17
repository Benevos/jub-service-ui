import { DataSourceType } from '@/types/datasource'
import { AllCommunityModule, ColDef } from "ag-grid-community";
import { AgGridProvider, AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import NoDataScreen from './NoDataScreen';
import { useEffect, useMemo, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { FaRegEye } from 'react-icons/fa';
import { PiBracketsCurlyBold } from 'react-icons/pi';

//TODO: Show download progress

interface ServiceCarouselProps {
    source: DataSourceType[]
    loading: boolean
}

function ServiceCarouselStructuredSource({ source, loading }: ServiceCarouselProps) 
{
    const CustomSpatialRenderer = ({ value } : CustomCellRendererProps<DataSourceType, number>) => (
        <span className='bg-[#e6e6e6] rounded-full px-2 py-1'>{value}</span>
    )

    //TODO
    const CustomInterestRenderer = ({ value } : CustomCellRendererProps<DataSourceType, string[]>) => {
        if (!value || value.length < 1) 
        {
            return (
                <div className='h-full w-full flex items-center justify-center'>
                    <span>-</span>
                </div>
            )
        }

        return value.map(val => <span key={val} className='bg-[#e6e6e6] rounded-full px-2 py-1'>{val}</span>)
    }

    const CustomNumericRenderer = ({ value } : CustomCellRendererProps<DataSourceType, Record<string, string | number>>) => {

        if (!value || Object.keys(value).length < 1) 
        {
            return (
                <div className='h-full w-full flex items-center justify-center'>
                    <span>-</span>
                </div>
            )
        }

        return (
            <div className='w-full h-full flex flex-wrap gap-1 max-w-[400px] py-2'>
                {
                    Object.entries(value).map(
                        ([key, val]) => <div key={key} className='bg-[#e6e6e6] rounded-full text-[10px] h-5 px-1.5 
                                                                    flex items-center justify-center'>
                            {
                                `${key.toUpperCase()}: ${
                                    typeof val === "number"
                                        ? val.toFixed(0)
                                        : val
                                }`
                            }
                        </div>
                    )
                    }
            </div>
        )
    }

    const CustomDetailsRenderer = (
    {
        value
    }: CustomCellRendererProps<
        DataSourceType,
        Record<string, string | number | boolean>
    >
    ) => {

        const [open, setOpen] = useState(false);

        const handleClose = () =>
        {
            setOpen(false)
        }

        return (
            <>

                <div className="w-full h-full flex items-center justify-center">

                    <Tooltip title="Mostrar crudo">
                        <IconButton
                            onClick={() => setOpen(true)}
                            size="small"
                        >
                            <FaRegEye/>
                        </IconButton>
                    </Tooltip>

                </div>

                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <div className='p-4'>


                        <div className='flex items-center gap-3 p-4'>
                            <PiBracketsCurlyBold size={30}/>

                            <span className='text-xl font-bold'>
                                Contenido en crudo del registro
                            </span>
                        </div>
                        
                            
                        <div>

                            <pre className="bg-[#f5f5f5] rounded-xl p-4 overflow-auto text-sm">
                                {
                                    JSON.stringify(value, null, 2)
                                }
                            </pre>

                        </div>

                        <div className='flex items-center justify-between p-4'>
                            <div className='w-1 h-1'></div>
                            

                            <Button
                                sx={{color: "black"}}
                                 onClick={handleClose}>
                                Cerrar
                            </Button>
                        </div>

                    </div>

                </Dialog>

            </>
        )
    }

    const rowData = useMemo(() => {
        return source.map(src => ({
            record_id: src.record_id,
            spatial_id: src.spatial_id,
            temporal_id: new Date(src.temporal_id).toLocaleDateString(
                "es-MX",
                {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit"
                }
            ),
            interest_ids: src.interest_ids,
            numerical_interest_ids: src.numerical_interest_ids,
            raw_payload: src.raw_payload
        }))
    }, [source])

    const [colDefs, setColDefs] = useState<ColDef[]>([
         {
            field: "record_id",
            headerName: "ID Registro"
        },
        {
            field: "spatial_id",
            headerName: "Espacial (VS)",
            cellRenderer: CustomSpatialRenderer
        },
        {
            field: "temporal_id",
            headerName: "Temporal (VT)"
        },
        {
            field: "interest_ids",
            headerName: "Interés (VI)",
            cellRenderer: CustomInterestRenderer,
            autoHeight: true
        },
        {
            field: "numerical_interest_ids",
            headerName: "Numérico",
            cellRenderer: CustomNumericRenderer,
            autoHeight: true
        },
        {
            field: "raw_payload",
            headerName: "Detalles",
            cellRenderer: CustomDetailsRenderer
        },
    ]);



    

    const modules = [AllCommunityModule]

    if(loading)
    {
        return (
            <div className='h-[600px] max-md:h-[300px] flex flex-col items-center justify-center bg-black gap-6 '>
                <div className='h-12 w-12 rounded-full border-4 border-gray-300 border-t-white animate-spin'/>
            </div>
        )
    }
    
    return (
        <div className="h-[600px] max-md:h-[300px] overflow-x-auto">

            {
                source.length < 1 ? 
                    <NoDataScreen/>
                :
                    <AgGridProvider modules={modules}>
                        <AgGridReact 
                            columnDefs={colDefs} 
                            rowData={rowData}
                            pagination={true}
                            paginationPageSize={100}
                            defaultColDef={{
                                flex: 1,
                                minWidth: 140,
                                resizable: true
                            }}
                            />
                    </AgGridProvider>
                
            }
            
        </div>
    )
}

export default ServiceCarouselStructuredSource