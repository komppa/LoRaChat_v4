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


// Action creators
export const connectWsServer = () => ({ type: 'WS_CONNECT', payload: {} })

export const disconnectWsServer = () => ({ type: 'WS_DISCONNECT', payload: {} })

export const sendWsServer = (payload: any) => ({ type: 'WS_SEND_MESSAGE', payload: payload })

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
        sendMessage: (state, action: PayloadAction<{ to: string, content: string }>) => {
            // New message sent by me
            state.push({
                // TODO CRIT I do not know these ids, server should create these?
                id: (Math.floor(Math.random() * 255)).toString(),
                from: 'Me',
                to: action.payload.to,
                content: action.payload.content,
                // Just for my client
                isRead: false,  // We do not care, this is my message
                receivedAt: Date.now(), // When this message was sent
                isCurrentUser: true,    // This message is sent by me
            })
        },
    },
})


export const { addMessages, markMessageAsRead, sendMessage } = messagesSlice.actions

export default messagesSlice.reducer