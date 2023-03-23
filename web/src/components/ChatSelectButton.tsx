import React from 'react'
import { Box, Typography } from '@mui/material'
import AvatarCircle from './AvatarCircle'
import { SignalCellular4Bar } from '@mui/icons-material'
import ConnectionStatusCircle from './ConnectionStatusCircle'

const ChatSelectButton = (
    { name, selected, online, rssi, onClick }: 
    { name: string, selected: boolean, online: boolean | null, rssi: string | null, onClick: () => void }
) => {

    return (
        
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                paddingLeft: '1rem',
                width: '90%',
                margin: '1rem auto',    // TODO fix 2rem
                '&:hover': {
                    backgroundColor: '#353d47'
                },
                backgroundColor: selected ? '#353d46' : '',
            }}
            onClick={() => onClick()}
        >
            {/* TODO get initials from props, to match other places also */}
            <Box
                sx={{
                    position: 'relative',
                }}
            >
                <AvatarCircle text={ name.charAt(0).toUpperCase() } />
                {/* If this ChatSelectButton is created for Global chat group,
                    do not create a status avatar for it since its up all time */}
                {
                    online !== null && <ConnectionStatusCircle connectionStatus={
                        online ? { status: 'connected' } : { status: 'disconnected' }
                    } />
                }
            </Box>

            <Typography
                variant='h5'
                sx={{
                    marginLeft: '0.5rem',
                    flexGrow: 1,
                    color: 'white',
                    fontWeight: 'bold',
                }}
            >
                { name }
            </Typography>
            <SignalCellular4Bar />
        </Box>
    )

}


export default ChatSelectButton
