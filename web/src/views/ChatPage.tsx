import React from 'react'
import {
    CssBaseline,
    Grid,
} from '@mui/material'


const ChatPage = () => {


    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />

            {/* Menu */}
            <Grid
                item
                xs={false}
                md={false}
                lg={1.75}
                sx={{
                    backgroundColor: 'yellow',
                }}
            >
                
            </Grid>

            {/* Chat groups and users */}
            <Grid
                item
                xs={false}
                md={3}
                lg={2.75}
                sx={{
                    backgroundColor: 'blue',
                }}
            >

            </Grid>

            {/* Chat window */}
            <Grid
                item
                xs={12}
                md={9}
                lg={12-1.75-2.75}
                sx={{
                    backgroundColor: 'pink',
                }}
            >
                
            </Grid>
                
        </Grid>
    )

}


export default ChatPage