import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface LoginState {
  isLoggedIn: boolean;
  username: string | null;
}

const initialState: LoginState = {
    isLoggedIn: !!localStorage.getItem('username') || false,
    username: localStorage.getItem('username') || null,
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<string>) => {
            state.isLoggedIn = true
            state.username = action.payload
            localStorage.setItem('username', action.payload)
        },
        logoutUser: (state) => {
            state.isLoggedIn = false
            state.username = null
            localStorage.removeItem('username')
        },
    },
})


export const { loginUser, logoutUser } = loginSlice.actions

export default loginSlice.reducer
