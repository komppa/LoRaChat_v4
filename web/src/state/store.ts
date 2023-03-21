import { combineReducers     } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
// Middlewares
import websocketMiddleware from './middlewares/websocketMiddleware'
// Reducers
import menuReducer from './reducers/menuReducer'
import messageReducer from './reducers/messageReducer'
import userReducer from './reducers/userReducer'




const reducer = combineReducers({

    menu: menuReducer,
    message: messageReducer,
    user: userReducer

})

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(websocketMiddleware),
    preloadedState: {}
})