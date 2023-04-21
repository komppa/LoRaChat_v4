import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  username: string
  rssi: number
  online: boolean
  lastSeen: number
}

interface RecvUser {
    username: string
    rssi: number
}


const initialState: User[] = []

const messagesSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUsers: (state, action: PayloadAction<RecvUser[]>) => {

            console.log('@addusers', action.payload)

            // Since server returns users that are online each time, we need to add new users that are not in the state
            // and update the online status to false for users that are already in the state but are not returned by the server

            action.payload.forEach((incomingUser) => {
                const existingUser = state.find((user) => user.username === incomingUser.username)
                if (existingUser) {
                    existingUser.online = true
                    existingUser.lastSeen = Date.now()
                } else {
                    state.push({
                        id: uuidv4(),
                        rssi: incomingUser.rssi,
                        username: incomingUser.username,
                        online: true,
                        lastSeen: Date.now()
                    })
                }
            })
        
            // Mark users on state as offline that are not returned by the server
            state.forEach((user) => {
                const existingUser = action.payload.find((u: RecvUser) => u.username === user.username)
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