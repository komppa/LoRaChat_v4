import { createSlice } from '@reduxjs/toolkit'


const menuSlice = createSlice({
    name: 'menu',
    initialState: 'G1',
    reducers: {
        setCurrentMenu(state, action) {
            return action.payload
        }
    },
})

export const { setCurrentMenu } = menuSlice.actions

export default menuSlice.reducer
