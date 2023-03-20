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

            action.payload.forEach((user: User) => {

                const existingUser = state.find((u) => u.username === user.username)

                if (!existingUser) {
                // New message, saving it to state
                    state.push({
                        id: user.id,
                        username: user.username,
                        rssi: user.rssi,
                        online: user.online,
                        lastSeen: user.lastSeen,
                    })
                }

            })

        },
    },
})


export const { addUsers } = messagesSlice.actions

export default messagesSlice.reducer