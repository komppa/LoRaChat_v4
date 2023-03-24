import { Middleware } from 'redux'
import { addMessages } from '../reducers/messageReducer'
import { addUsers } from '../reducers/userReducer'
import { setConnectionStatus } from '../reducers/connectionSlice'


const websocketMiddleware: Middleware = ({ dispatch, getState }) => {

    let websocket: WebSocket | null = null
    let reconnectInterval: ReturnType<typeof setInterval> | null = null
    // let reconnectInterval: any | null = null

    const connect = () => {

        if (websocket !== null) {
            websocket.close()
        }
    
        dispatch(setConnectionStatus('connecting'))
    
        websocket = new WebSocket('ws://localhost:8180/ws')
    
        websocket.onopen = () => {
            
            // Set state to connected to show that we are connected to the server
            dispatch(setConnectionStatus('connected'))

            // Send a message to the server that we are connected with our username
            websocket?.send(JSON.stringify({
                type: 'heartbeat',
                data: getState().login.username,
            }))
    
            if (reconnectInterval) {
                clearInterval(reconnectInterval)
                reconnectInterval = null
            }
        }
    
        websocket.onmessage = (event) => {
            const payload = JSON.parse(event.data)

            // eslint-disable-next-line no-prototype-builtins
            if (payload.hasOwnProperty('type') && payload.type === 'messages') {
                dispatch(addMessages({
                    messages: payload.data,
                    myUsername: getState().login.username,
                }))
            }

            // eslint-disable-next-line no-prototype-builtins
            if (payload.hasOwnProperty('type') && payload.type === 'users') {
                dispatch(addUsers(payload.data))
            }
        }
    
        websocket.onclose = () => {
            dispatch(setConnectionStatus('disconnected'))
    
            if (!reconnectInterval) {
                console.log('settings timeout for reconnect')
                reconnectInterval = setInterval(() => {
                    console.log('timeout now')
                    dispatch({ type: 'WS_RECONNECT' })
                }, 3000) // Reconnect attempt interval (5 seconds)
            }
        }
    
        websocket.onerror = (event) => {
            console.log('WebSocket error:', event)
        }
    }

    return (next) => (action) => {
        switch (action.type) {
        
        case 'WS_CONNECT':
            connect()
            break

        case 'WS_RECONNECT':
            dispatch(setConnectionStatus('reconnecting'))
            connect()
            break
          
        case 'WS_DISCONNECT':
            if (websocket) {
                websocket.close()
            }
            websocket = null
            break
          
        case 'WS_SEND_MESSAGE':

            if (websocket) {
                websocket.send(JSON.stringify(
                    { type: 'message', data: action.payload }
                ))
            } else {
                console.log('WebSocket is not connected')
            }
            break
          
        default:
            return next(action)
        }

        return next(action)
    }
}

export default websocketMiddleware
