import React from 'react'
import { Box } from '@mui/material'
import { ConnectionState } from '../state/reducers/connectionSlice'


const ConnectionStatusCircle = ({ connectionStatus }: { connectionStatus: ConnectionState }) => {

    return (
        <Box
            sx={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: connectionStatus.status === 'connected' ? 'green' : 'red',
                position: 'absolute',
                bottom: 0,
                right: 0,
                border: '1.5px solid black',
            }}
        />
    )
}


export default ConnectionStatusCircle