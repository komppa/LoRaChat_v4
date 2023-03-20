import React from 'react'
import { Box, Typography } from '@mui/material'
import AvatarCircle from './AvatarCircle'
import { SignalCellular4Bar } from '@mui/icons-material'

const ChatSelectButton = ({ name, selected, onClick }: { name: string, selected: boolean, onClick: () => void }) => {

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
            <AvatarCircle text={ name.charAt(0).toUpperCase() } />
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
