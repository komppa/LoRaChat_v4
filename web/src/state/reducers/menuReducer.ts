import { createSlice } from '@reduxjs/toolkit'


const menuSlice = createSlice({
    name: 'menu',
    initialState: 'Global chat group 1',
    reducers: {
        setCurrentMenu(state, action) {
            return action.payload
        }
    },
})

export const { setCurrentMenu } = menuSlice.actions

export default menuSlice.reducer
