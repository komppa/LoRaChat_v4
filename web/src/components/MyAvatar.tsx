import React from 'react'
import {
    Box,
    Typography,
} from '@mui/material'
import AvatarCircle from './AvatarCircle'


interface MyAvatarProps {
    username: string
    connectionStatus: string
}


const MyAvatar: React.FC<MyAvatarProps> = ({ username, connectionStatus }) => {


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

                {/* Connection status LED */}
                <Box
                    sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: connectionStatus === 'connected' ? 'green' : 'red',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        border: '1.5px solid black',
                    }}
                />
            </Box>

            {/* Username */}
            <Typography variant="h4" component="div" sx={{ mt: 1, fontWeight: 'bold', color: 'white' }}>
                { username }
            </Typography>

            {/* Connection status text */}
            <Typography variant="subtitle2" component="div" sx={{ mt: 0, fontStyle: 'italic', color: 'white' }}>
                { connectionStatus }
            </Typography>

        </Box>
    )
}
  
  

export default MyAvatar