import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface ConnectionState {
  status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting';
}

const initialState: ConnectionState = {
    status: 'disconnected',
}

const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setConnectionStatus: (state, action: PayloadAction<ConnectionState['status']>) => {
            state.status = action.payload
        },
    },
})

export const { setConnectionStatus } = connectionSlice.actions

export default connectionSlice.reducer