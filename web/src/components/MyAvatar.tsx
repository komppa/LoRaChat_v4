import React from 'react'
import {
    Box,
    Typography,
    Avatar,
    CssBaseline,
} from '@mui/material'
import '../index.css'


interface MyAvatarProps {
    callsign: string
}


const MyAvatar: React.FC<MyAvatarProps> = ({ callsign }) => {

    // TODO implement getter for this connection status string
    const connectionString = 'connected'

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
                <Avatar
                    sx={{
                        border: '1px solid black',
                        width: theme => theme.spacing(8),
                        height: theme => theme.spacing(8),
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 2.5,
                        backgroundColor: 'pink',
                        color: 'black',
                    }}
                >
                    <Typography variant="h4">
                        {
                            callsign.charAt(callsign.length - 2).toUpperCase() +    // TODO allow longer callsigns also. The first character if two character callsignc
                            callsign.charAt(callsign.length - 1).toUpperCase()      // Last character of the callsign
                        }
                    </Typography>
                </Avatar>

                {/* Connection status LED */}
                <Box
                    sx={{
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        backgroundColor: 'green',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        border: '1px solid black',
                    }}
                />
            </Box>

            {/* Callsign */}
            <Typography variant="h4" component="div" sx={{ mt: 1, fontWeight: 'bold', color: 'white' }}>
                {callsign}
            </Typography>

            {/* Connection status text */}
            <Typography variant="subtitle2" component="div" sx={{ mt: 0, fontStyle: 'italic', color: 'white' }}>
                { connectionString }
            </Typography>

        </Box>
    )
}
  
  

export default MyAvatar