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
    
        // To indicate that we are trying to connect to the server.
        // Shon under user initls under the user avatar
        dispatch(setConnectionStatus('connecting'))

        // Get the server address from the location object
        // or use the default address of the ESP32
        const serverAddr = location.hostname || '192.168.4.1'
    
        websocket = new WebSocket(`ws://${serverAddr}/ws`)
    
        websocket.onopen = () => {
            
            // Set state to connected to show that we are connected to the server
            dispatch(setConnectionStatus('connected'))

            // Send a message to the server that we are connected with our username
            websocket?.send(JSON.stringify({
                type: 'hb',
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
            if (payload.hasOwnProperty('type') && payload.type === 'message') {
                dispatch(addMessages({
                    messages: payload.data,
                    myUsername: getState().login.username,
                }))
            }

            // eslint-disable-next-line no-prototype-builtins
            if (payload.hasOwnProperty('type') && payload.type === 'hb') {
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
