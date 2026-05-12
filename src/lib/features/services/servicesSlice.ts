import ServiceType from "@/types/service";
import { createSlice } from "@reduxjs/toolkit";

type ServicesStateType = {
    performanceMode: boolean,
    data: ServiceType[],
    loading: boolean
    selected: ServiceType | null,
    open: boolean,
    fetched: boolean
}

const initalState: ServicesStateType = {
    performanceMode: true,
    data: [],
    loading: false,
    selected: null,
    open: false,
    fetched: false
}

export const servicesSlice = createSlice({
    name: 'services',
    initialState: initalState,
    reducers: {
        setServicesData: (state, action) =>
        {
            state.data = action.payload;
        },
        setServicesLoading: (state, action) =>
        {
            state.loading = action.payload
        },
        setSelectedService: (state, action) => {
            state.selected = action.payload;
        },
        setOpenService: (state, action) =>
        {
            state.open = action.payload
        },
        setFetchedServices: (state, action) =>
        {
            state.fetched = action.payload
        },
        setServicePerfomanceMode: (state, action) =>
        {
            state.performanceMode = action.payload
        }
    }
});

export const { 
    setServicesData, 
    setServicesLoading, 
    setSelectedService, 
    setOpenService, 
    setFetchedServices,
    setServicePerfomanceMode
} = servicesSlice.actions;
export default servicesSlice.reducer;