import React from 'react'
import ChatPage from './views/ChatPage'
import { createTheme, ThemeProvider } from '@mui/material/styles'


const theme = createTheme({
    typography: {
        fontFamily: 'Segoe UI, sans-serif',
    },
})
  
const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <ChatPage />
        </ThemeProvider>
    )
}

export default App