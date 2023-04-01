import React, { Suspense } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import LoginPage from './views/LoginPage'


const ChatPage = React.lazy(() => import('./views/ChatPage'))


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
                    <Suspense fallback={<div>Loading...</div>}>
                        <ChatPage />
                    </Suspense>
                    :
                    <Suspense fallback={<div>Loading...</div>}>
                        <LoginPage />
                    </Suspense>
            }
        </ThemeProvider>
    )
}

export default App