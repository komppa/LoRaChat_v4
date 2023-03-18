import React from 'react'
import {
    CssBaseline,
    Grid,
    Hidden,
    Divider,
} from '@mui/material'
import MyAvatar from '../components/MyAvatar'



const ChatPage: React.FC = () => {


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
                    backgroundColor: '#1D232A',
                }}
            >
                <Hidden lgDown>
                    <MyAvatar
                        callsign={'Komppa'}
                    />
                    {/* <Divider light sx={{ backgroundColor: 'white' }} /> */}
                    <Divider variant="inset" />
                </Hidden>
            </Grid>

            {/* Chat groups and users */}
            <Grid
                item
                xs={false}
                md={3}
                lg={2.75}
                sx={{
                    backgroundColor: '#282E35',
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
                    backgroundColor: '#353B43',
                }}
            >
                
            </Grid>
                
        </Grid>
    )

}


export default ChatPage