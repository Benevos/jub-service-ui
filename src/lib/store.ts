import { configureStore } from '@reduxjs/toolkit'
import servicesReducer from "./features/services/servicesSlice"
import observatoriesReducer from "./features/observatories/observatoriesSlice";
import snackbarReducer from "./features/snackbar/snackbarSlice";
import authReducer from "./features/auth/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
        services: servicesReducer,
        observatories: observatoriesReducer,
        snackbar: snackbarReducer,
        auth: authReducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']