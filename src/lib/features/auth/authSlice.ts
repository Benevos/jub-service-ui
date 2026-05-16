import AuthType from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: AuthType = {
    access_token: null,
    temporal_secret_key: null
};


export const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        setAuth: (state, action) => 
        {
            return action.payload
        }
    },
});

export const {
    setAuth
} = authSlice.actions;

export default authSlice.reducer;