import { createSlice, PayloadAction, ThunkAction, AnyAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { v4 as uuidv4 } from 'uuid'


export interface Message {
  id: string
  from: string
  to: string
  content: string
  isRead: boolean
  receivedAt: number
  isCurrentUser: boolean
}

interface MessagePayloadAction {
    myUsername: string
    messages: Message[]
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
        addMessages: (state, action: PayloadAction<MessagePayloadAction>) => {

            action.payload.messages.forEach((message: Message) => {

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
                        isCurrentUser: message.from === action.payload.myUsername ? true : false,
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
        addMessage: (state, action: PayloadAction<{ from: string, to: string, content: string }>) => {
            // New message sent by me
            state.push({
                // TODO CRIT I do not know these ids, server should create these?
                id: uuidv4(),
                from: action.payload.from,
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


export const { addMessages, markMessageAsRead, addMessage } = messagesSlice.actions

export const sendMessage = (
    payload: { to: string, content: string }
): ThunkAction<void, RootState, unknown, AnyAction> => (
    dispatch, getState
) => {
    dispatch(addMessage({
        ...payload,
        // TODO ugly, fix this
        from: getState().login.username || '',
    }))
    dispatch(sendWsServer({
        from: getState().login.username,
        to: payload.to,
        content: payload.content,
    }))
}



export default messagesSlice.reducer