import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DrawerState = {
    open: boolean
};

const initialState: DrawerState = {
    open: false
};

export const drawerSlice = createSlice({
    name: "snackbar",

    initialState,

    reducers: {
        toggleDrawer: (state) =>
        {
            state.open = !state.open
        },
        showDrawer: (state) => 
        {
            state.open = true
        },
        hideDrawer: (state) => 
        {
            state.open = false
        },
    },
});

export const {
    showDrawer,
    hideDrawer,
    toggleDrawer,
} = drawerSlice.actions;

export default drawerSlice.reducer;