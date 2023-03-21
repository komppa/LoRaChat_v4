import { combineReducers } from 'redux'
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
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

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>

export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = () => useDispatch<AppDispatch>() // Add this line