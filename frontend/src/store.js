import { configureStore } from '@reduxjs/toolkit'
import siteConfigSlice from './Slices/siteConfigSlice'
import authSlice from './Slices/authSlice'

export const store = configureStore({
    reducer: {
        siteConfig: siteConfigSlice,
        auth: authSlice
    }
})