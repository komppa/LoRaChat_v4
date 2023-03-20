import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

// import menuReducer from './reducers/menuReducer'
import messageReducer from './reducers/messageReducer'



const reducer = combineReducers({

    // menu: menuReducer,
    message: messageReducer,

})

export const store = configureStore({
    reducer,
    preloadedState: {}
})