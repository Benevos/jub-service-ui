import { ObservatoryDetailsType, ObservatoryType } from "@/types/observatory";
import { createSlice } from "@reduxjs/toolkit";

type ObservatoriesStateType = {
    data: ObservatoryType[],
    details: ObservatoryDetailsType[],
    coincidentDetails: ObservatoryDetailsType[],
    loading: boolean
}

const initalState: ObservatoriesStateType = {
    data: [],
    details: [],
    coincidentDetails: [],
    loading: false,
}

export const servicesSlice = createSlice({
    name: 'observatories',
    initialState: initalState,
    reducers: {
        setObservatoriesData: (state, action) =>
        {
            state.data = action.payload;
        },
        setObservatoriesDetailsData: (state, action) =>
        {
            state.details = action.payload;
        },
        setCoincidentObservatoriesDetails: (state, action) =>
        {
            state.coincidentDetails = action.payload;
        },
        setObservatoriesLoading: (state, action) =>
        {
            state.loading = action.payload
        },
    }
});

export const { 
    setObservatoriesData, 
    setObservatoriesLoading, 
    setObservatoriesDetailsData, 
    setCoincidentObservatoriesDetails 
} = servicesSlice.actions;
export default servicesSlice.reducer;