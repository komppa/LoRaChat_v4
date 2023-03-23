import React from 'react'
import {
    Box,
    Typography,
} from '@mui/material'
import AvatarCircle from './AvatarCircle'
import ConnectionStatusCircle from './ConnectionStatusCircle'
import { ConnectionState } from '../state/reducers/connectionSlice'


interface MyAvatarProps {
    username: string
    connection: string
}


const MyAvatar: React.FC<MyAvatarProps> = ({ username, connection }) => {


    // TODO implement getter for avatar color


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                }}
            >
                {/* Avatar circle */}
                <AvatarCircle text={ username.charAt(0) } />

                <ConnectionStatusCircle connectionStatus={
                    connection === 'connected' ? { status: 'connected' } : { status: 'disconnected' }
                } />                
            </Box>

            {/* Username */}
            <Typography variant="h4" component="div" sx={{ mt: 1, fontWeight: 'bold', color: 'white' }}>
                { username }
            </Typography>

            {/* Connection status text */}
            <Typography variant="subtitle2" component="div" sx={{ mt: 0, fontStyle: 'italic', color: 'white' }}>
                { connection }
            </Typography>

        </Box>
    )
}
  
  

export default MyAvatar