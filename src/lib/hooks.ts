import { useDispatch, useSelector, useStore } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch, AppStore } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = useStore

export const useAppRequiredAuth = () => {
    const auth = useAppSelector(state => state.auth)

    if (!auth.access_token || !auth.temporal_secret_key) {
        throw new Error("Auth not found");
    }

    return auth
}