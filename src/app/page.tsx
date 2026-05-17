"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ServiceOverview from "@/components/Services/Service/ServiceOverview";
import ServicesDisplay from "@/components/Services/ServicesDisplay";
import ServicesForm from "@/components/Services/ServicesForm";
import { setCoincidentObservatoriesDetails, setObservatoriesData, setObservatoriesDetailsData, setObservatoriesLoading} from "@/lib/features/observatories/observatoriesSlice";
import { showSnackbar } from "@/lib/features/snackbar/snackbarSlice";
import { useAppRequiredAuth, useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ObservatoryDetailsType } from "@/types/observatory";
import { useEffect } from "react";


function Home() 
{
  const dispatch = useAppDispatch()

  const observatories = useAppSelector(state => state.observatories.data)
  const observatoriesDetails = useAppSelector(state => state.observatories.details)
  const loadingObservatories = useAppSelector(state => state.observatories.loading)

  const auth = useAppRequiredAuth()

  const selectedService = useAppSelector(state => state.services.selected);

  const fetchObservatories = async () =>
  {
    try
    {
      dispatch(setObservatoriesLoading(true))

      const response = await fetch(
        "https://apix.tamps.cinvestav.mx/jub/api/v2/search/observatories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.access_token}`,
            "Temporal-Secret-Key": auth.temporal_secret_key,
          },
          body: JSON.stringify({
            query: "jub.v1.VS(*).VT(*).VI(*)",
            limit: 24,
            skip: 0,
            strict: false
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Error al obtener observatorios")
      }

      const data = await response.json()

      // console.log("OBSERVATORIES")
      // console.log(data)

      dispatch(setObservatoriesData(data))
    }
    catch(error)
    {
      dispatch(showSnackbar({
        message: "Error crítico: No se pudieron obtener los observatorios.",
        severity: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      }))
    }
  }

  const fetchObservatoriesDetails = async () => 
  {
    if (!auth.access_token || !auth.temporal_secret_key) {
      return
    }
    try
    {
      if (observatories.length === 0) return

      const observatories_id = observatories.map(
        observatory => observatory.observatory_id
      )

      const response = await fetch(
        "https://apix.tamps.cinvestav.mx/jub/api/v2/observatories/details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.access_token}`,
            "Temporal-Secret-Key": auth.temporal_secret_key,
          },
          body: JSON.stringify({
            ids: observatories_id
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Error en la petición")
      }

      const data = await response.json()

      //console.log("OBSERVATORIES DETAILS")
      //console.log(data)
      dispatch(setObservatoriesDetailsData(data))
    }
    catch(error)
    {
      console.error(error)
    }
    finally
    {
      dispatch(setObservatoriesLoading(false))
    }
  }

  const fetchCoincidentObservatory = async () =>
  {
    if (!selectedService) return

    const coincidentObservatoriesDetails: ObservatoryDetailsType[] = []

    for (let i = 0; i < observatoriesDetails.length; i++) 
    {
      for (let j = 0; j < observatoriesDetails[i].services.length; j++) 
      {
        if(selectedService.service_id === observatoriesDetails[i].services[j].service_id)
        {
          if(coincidentObservatoriesDetails.includes(observatoriesDetails[i]))
          {
            continue
          }

          coincidentObservatoriesDetails.push(observatoriesDetails[i])
        }
      }
    }

    if(coincidentObservatoriesDetails.length < 1)
    {
      //console.log(`Error: El servicio "${selectedService.service_id}" no coincide con ningún observatorio.`)
      dispatch(setCoincidentObservatoriesDetails([]))
      return
    }

    //console.log("COINCIDENT OBSERVATORIES")
    //console.log(coincidentObservatoriesDetails)

    dispatch(setCoincidentObservatoriesDetails(coincidentObservatoriesDetails))
  }

  useEffect(() =>
  {
    console.log(auth)
    fetchObservatories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => 
  {
    fetchCoincidentObservatory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService])

  useEffect(() => 
  {
    fetchObservatoriesDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observatories])

  return (
 
      <div className="h-full w-full flex flex-col items-center">

        <div className="w-full max-w-[1480px] py-8 px-4">

          <div className="flex flex-col items-center mb-6">
            <h1 className="text-[48px] max-md:text-xl font-black leading-14 text-center max-md:leading-6">
              Plataforma de ciencia de datos: ecosistema JUB (Nez y Xelhua)
            </h1>

            <label className="text-[#757575] text-center text-[1rem] tracking-wide">
              Descubre y explora los servicios del ecosistema JUB por nombre o visibilidad.
            </label>
          </div>

          <ServicesForm />

          <ServicesDisplay />

          <ServiceOverview />

        </div>

      </div>

  )
}

export default ProtectedRoute(Home);