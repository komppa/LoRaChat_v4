import { combineReducers     } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
// Middlewares
import websocketMiddleware from './middlewares/websocketMiddleware'
// Reducers
import menuReducer from './reducers/menuReducer'
import messageReducer from './reducers/messageReducer'
import userReducer from './reducers/userReducer'
import connectionSlice from './reducers/connectionSlice'
import loginSlice from './reducers/loginSlice'



const reducer = combineReducers({

    menu: menuReducer,
    message: messageReducer,
    connection: connectionSlice,
    user: userReducer,
    login: loginSlice,

})

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(websocketMiddleware),
    preloadedState: {}
})