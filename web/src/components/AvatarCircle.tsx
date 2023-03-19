import React from 'react'
import { Avatar, Typography } from '@mui/material'


const AvatarCircle: React.FC<{ text: string }> = ({ text }) => {
    
    return (
        <Avatar
            sx={{
                border: '2.5px solid black',
                width: theme => theme.spacing(8),
                height: theme => theme.spacing(8),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'pink',
                color: 'black',
            }}
        >
            <Typography variant="h3" style={{ fontWeight: 'bold' }}>
                { text }
            </Typography>
        </Avatar>
    )
    
}

export default AvatarCircle