import React, { useState } from 'react'
import { setServicesLoading, setServicesData, setFetchedServices } from '@/lib/features/services/servicesSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { Button, IconButton, MenuItem, Select, SelectChangeEvent, Snackbar, SnackbarCloseReason, TextField, Tooltip } from '@mui/material'
import { FaRegEye, FaSearch } from 'react-icons/fa'
import { GoServer } from 'react-icons/go'
import { IoReload } from 'react-icons/io5'
import { MdContentCopy } from 'react-icons/md'
import { PiBracketsCurlyBold } from 'react-icons/pi'

type ServiceFilters = {
  name: string;
  provider: string;
  visibility: string;
};

function ServicesForm() {

    const dispatch = useAppDispatch()
    
    const loading = useAppSelector(state => state.services.loading)
    const observatoriesLoading = useAppSelector(state => state.observatories.loading)

    const [serviceFilters, setServiceFilters] = useState<ServiceFilters>({
        name: "",
        provider: "all",
        visibility: "all",
    });

    const [openSnackBar, setOpenSnackbar] = useState<boolean>(false)

    const buildJubQuery = (filters: ServiceFilters): string =>
    {
        const params = [];

        if (
            filters.name === "" &&
            filters.provider === "all" &&
            filters.visibility === "all"
        ) 
        {
            return "jub.v1.SVC(*)";
        }

        if (filters.name) {
            params.push("name=" + filters.name);
        }

        if (filters.provider !== "all") {
            params.push("provider=" + filters.provider);
        }

        if (filters.visibility !== "all") {
            params.push(`public=${filters.visibility === "public"}`);
        }

        return `jub.v1.SVC(${params.join(",")})`;
    };
    
    const jubQuery = buildJubQuery(serviceFilters);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
      {
        e.preventDefault();
    
        dispatch(setServicesLoading(true))
    
        try {
          const response = await fetch(
            "https://apix.tamps.cinvestav.mx/jub/api/v2/search/services",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: jubQuery,
              }),
            }
          );
    
          if (!response.ok) {
            throw new Error("Error en la petición");
          }
    
          const data = await response.json();
          
          console.log("SERVICES")
          console.log(data);
    
          dispatch(setServicesData(data))
    
          dispatch(setServicesLoading(false))

          dispatch(setFetchedServices(true))
        } catch (error) {
          console.error(error);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const {name, value} = e.target;

        setServiceFilters((prev) => ({
            ...prev, [name]: value
        }))
    }

    const handleSelectChange = (e: SelectChangeEvent) =>
    {
        const {name, value} = e.target;

        setServiceFilters((prev) => ({
        ...prev, [name]: value
        }))
    }


    const handleCleanClick = () =>
    {
        setServiceFilters({
        name: "",
        provider: "all",
        visibility: "all",
        })
    }

    const handleCopyClick = () =>
    {
        setOpenSnackbar(true)
    }

    const handleCloseSnackbar = async (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        await navigator.clipboard.writeText(jubQuery);
        setOpenSnackbar(false);
    };

    return (

        <>
            <Snackbar 
                open={openSnackBar} 
                onClose={handleCloseSnackbar}
                autoHideDuration={1000} 
                message="Consulta copiada"/>
            
                <form className="bg-white form-shadow p-6 rounded-2xl" onSubmit={handleSubmit}>
                <div className="w-full flex gap-4 max-md:flex-col">

                    <div className="flex flex-col gap-2.5 flex-2">

                        <div className="flex items-center gap-1">
                            <div className="bg-[#e6e6e6] rounded-lg h-8 w-8 text-xs flex justify-center items-center">
                                <FaSearch/>
                            </div>
                            <label className="font-bold text-sm">Nombre o palabra clave</label>
                        </div>

                        <TextField 
                            fullWidth
                            label="Nombre de servicio" 
                            name="name" 
                            value={serviceFilters.name}
                            onChange={handleTextChange}/>
                    </div>

                    <div className="flex flex-col gap-2.5 flex-1">
                        <div className="flex items-center gap-1">
                            <div className="bg-[#e6e6e6] rounded-lg h-8 w-8 text-sm flex justify-center items-center">
                                <GoServer/>
                            </div>

                            <label className="font-bold text-sm">Proveedor</label>
                        </div>

                        <Select
                            fullWidth
                            name="provider"
                            value={serviceFilters.provider}
                            onChange={handleSelectChange}
                        >
                                <MenuItem value={"all"}>Todos</MenuItem>
                                <MenuItem value={"NEZ"}>Nez</MenuItem>
                                <MenuItem value={"XELHUA"}>Xelhua</MenuItem>
                                <MenuItem value={"EXTERNAL"}>Externo</MenuItem>
                                <MenuItem value={"OTHER"}>Otro</MenuItem>
                            </Select>
                    </div>


                    <div className="flex flex-col gap-2.5 flex-1">
                        <div className="flex items-center gap-1">
                            <div className="bg-[#e6e6e6] rounded-lg h-8 w-8 text-sm flex justify-center items-center">
                                <FaRegEye/>
                            </div>

                            <label className="font-bold text-sm">Visibilidad</label>
                        </div>

                        <Select
                            fullWidth
                            name="visibility"
                            value={serviceFilters.visibility}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={"all"}>Todos</MenuItem>
                            <MenuItem value={"public"}>Públicos</MenuItem>
                            <MenuItem value={"private"}>Privados</MenuItem>
                        </Select>
                    </div>
                </div>

                <hr className="border-[#e6e6e6] my-4"/>

                <div className="flex justify-between max-md:flex-col max-md:items-center max-md:gap-3">

                    <div className="flex items-center gap-2">
                    <PiBracketsCurlyBold className="text-[#757575]"/>

                    <label className="text-sm font-bold text-[#757575]">Consulta:</label>

                    <Tooltip title="Copiar">
                        <IconButton size="small" onClick={handleCopyClick}>
                            <MdContentCopy/>
                        </IconButton>
                    </Tooltip>

                        <div className="text-sm bg-[#e6e6e6] text-[#757575] py-1 px-2 rounded-2xl overflow-x-auto
                                    max-w-[350px] max-md:max-w-[150px]">
                            {jubQuery}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button 
                            variant="text" 
                            onClick={handleCleanClick}
                            sx={{color: "black"}}
                            startIcon={<IoReload size={15}/>}
                        >
                            LIMPIAR
                        </Button>

                        <Button 
                        type="submit"
                        variant="contained" 
                        disabled={observatoriesLoading}
                        loading={loading}
                        sx={{backgroundColor: "#cfcfcf", color: "black"}}
                        startIcon={<FaSearch size={15}/>}>
                            BUSCAR
                        </Button>
                    </div>

                </div>
            </form>
        </>
        
    )
}

export default ServicesForm