import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface User {
  id: string
  username: string
  rssi: string
  online: boolean
  lastSeen: number
}


const initialState: User[] = []

const messagesSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUsers: (state, action: PayloadAction<User[]>) => {

            // Since server returns users that are online each time, we need to add new users that are not in the state
            // and update the online status to false for users that are already in the state but are not returned by the server

            action.payload.forEach((incomingUser) => {
                const existingUser = state.find((user) => user.username === incomingUser.username)
                if (existingUser) {
                    existingUser.online = true
                    existingUser.lastSeen = Date.now()
                } else {
                    state.push({ ...incomingUser, online: true, lastSeen: Date.now() })
                }
            })
        
            // Mark users on state as offline that are not returned by the server
            state.forEach((user) => {
                const existingUser = action.payload.find((u) => u.username === user.username)
                if (!existingUser) {
                    user.online = false
                    user.lastSeen = Date.now()
                }
            })
            
        },
    },
})


export const { addUsers } = messagesSlice.actions

export default messagesSlice.reducer