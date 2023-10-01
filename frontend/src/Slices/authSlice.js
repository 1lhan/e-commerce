import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedin: false,
        user: {}
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedin = true
            state.user = action.payload
        },
        logout: (state, action) => {
            state.isLoggedin = false
            state.user = {}
        },
        updateUser: (state,action) => {
            state.user = action.payload
        }
    }
})

export const { login, logout,updateUser } = authSlice.actions;
export default authSlice.reducer