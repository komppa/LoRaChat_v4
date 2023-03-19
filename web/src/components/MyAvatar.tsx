import React from 'react'
import {
    Box,
    Typography,
} from '@mui/material'
import AvatarCircle from './AvatarCircle'


interface MyAvatarProps {
    callsign: string
}


const MyAvatar: React.FC<MyAvatarProps> = ({ callsign }) => {

    // TODO implement getter for this connection status string
    const connectionString = 'connected to the network'

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
                <AvatarCircle text={ callsign.charAt(callsign.length -2).toUpperCase() } />

                {/* Connection status LED */}
                <Box
                    sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'green',
                        position: 'absolute',
                        bottom: 4,
                        right: 4,
                        border: '2.5px solid black',
                    }}
                />
            </Box>

            {/* Callsign */}
            <Typography variant="h4" component="div" sx={{ mt: 1, fontWeight: 'bold', color: 'white' }}>
                { callsign }
            </Typography>

            {/* Connection status text */}
            <Typography variant="subtitle2" component="div" sx={{ mt: 0, fontStyle: 'italic', color: 'white' }}>
                { connectionString }
            </Typography>

        </Box>
    )
}
  
  

export default MyAvatar