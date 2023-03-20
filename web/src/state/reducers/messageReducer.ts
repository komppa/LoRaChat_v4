import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface Message {
  id: string
  from: string
  to: string
  content: string
  isRead: boolean
  receivedAt: number
  isCurrentUser: boolean
}


const initialState: Message[] = []

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessages: (state, action: PayloadAction<Message[]>) => {

            action.payload.forEach((message: Message) => {

                const existingMessage = state.find((m) => m.id === message.id)

                if (!existingMessage) {
                // New message, saving it to state
                    state.push({
                        id: message.id,
                        from: message.from,
                        to: message.to,
                        content: message.content,
                        isRead: false,
                        receivedAt: Date.now(),
                        // TODO VERY CRIT, get current username and
                        // decide whether this is me
                        isCurrentUser: message.from === 'Me' ? true : false,
                    })
                }

            })

        },
        markMessageAsRead: (state, action: PayloadAction<string>) => {

            const messageId = action.payload

            const messageIndex = state.findIndex((message) => message.id === messageId)
      
            if (messageIndex >= 0) {
                state[messageIndex].isRead = true
            }

        },
    },
})


export const { addMessages, markMessageAsRead } = messagesSlice.actions

export default messagesSlice.reducer