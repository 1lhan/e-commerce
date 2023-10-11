import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedin: false,
        user: {},
        confirmedCart: []
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
        updateUser: (state, action) => {
            state.user = action.payload
        },
        setConfirmedCart: (state, action) => {
            state.confirmedCart = action.payload
        }
    }
})

export const { login, logout, updateUser, setConfirmedCart } = authSlice.actions;
export default authSlice.reducer