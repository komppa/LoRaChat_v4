import { Middleware } from 'redux'
import { addMessages } from '../reducers/messageReducer'
import { addUsers } from '../reducers/userReducer'

const websocketMiddleware: Middleware = ({ dispatch }) => {

    let websocket: WebSocket | null = null

    return (next) => (action) => {
        switch (action.type) {
        
        case 'WS_CONNECT':
            if (websocket !== null) {
                websocket.close()
            }
          
            // Initialize WebSocket connection
            websocket = new WebSocket('ws://localhost:8080')
          
            // Set up WebSocket event listeners
            
            // websocket.onopen = (event) => {}
          
            websocket.onmessage = (event) => {
                const payload = JSON.parse(event.data)

                // eslint-disable-next-line no-prototype-builtins
                if (payload.hasOwnProperty('type') && payload.type === 'messages') {
                    dispatch(addMessages(payload.data))
                }

                // eslint-disable-next-line no-prototype-builtins
                if (payload.hasOwnProperty('type') && payload.type === 'users') {
                    dispatch(addUsers(payload.data))
                }
            }
          
            // websocket.onclose = (event) => {}
            // websocket.onerror = (event) => {}
          
            break
          
        case 'WS_DISCONNECT':
            if (websocket) {
                websocket.close()
            }
            websocket = null
            break
          
        case 'WS_SEND_MESSAGE':

            if (websocket) {
                websocket.send(JSON.stringify(action.payload))
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
