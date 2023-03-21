import React from 'react'
import ChatPage from './views/ChatPage'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import LoginPage from './views/LoginPage'


const theme = createTheme({
    typography: {
        fontFamily: 'Segoe UI, sans-serif',
    },
})
  
const App = () => {

    // For fetching the current user and loging status
    const isLoggedIn = useSelector((state: any) => state.login.isLoggedIn)

    return (
        <ThemeProvider theme={theme}>
            {
                isLoggedIn
                    ?
                    <ChatPage />
                    :
                    <LoginPage />
            }
        </ThemeProvider>
    )
}

export default App