import React from 'react'
import {
    CssBaseline,
    Grid,
    Hidden,
    Divider,
} from '@mui/material'
import MyAvatar from '../components/MyAvatar'
import MainMenu from '../components/MainMenu'
import SearchBar from '../components/SearchBar'
import { MenuTitle } from '../components/MenuListButton'
import ChatSelectButton from '../components/ChatSelectButton'
import { ChatHeader, Chat } from '../components/Chat'


const ChatPage = () => {

    const messages = [
        {
            sender: 'Jakke',
            content: 'Hello!',
            isCurrentUser: false,
        },
        {
            sender: 'K',
            content: 'Hello, World!\\n',
            isCurrentUser: true,
        },
        {
            sender: 'Jakke',
            content: 'Great!',
            isCurrentUser: false,
        },
    ]


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
                        callsign={'OH9KR'}
                    />

                    {/* <Divider light sx={{ backgroundColor: 'white' }} /> */}
                    <Divider
                        orientation="horizontal"
                        variant="middle"
                        sx={{
                            width: '80%',
                            margin: '0 auto',
                            backgroundColor: '#404040',
                            mt: 4,
                        }}
                    />

                    <MainMenu />
                    
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

                <Hidden mdDown>
                    <SearchBar />

                    <Divider
                        orientation="horizontal"
                        variant="middle"
                        sx={{
                            width: '80%',
                            margin: '0 auto',
                            backgroundColor: '#404040',
                            mt: 4,
                        }}
                    />

                    {/* Global chat groups */}
                    <MenuTitle title='Global' />

                    <ChatSelectButton
                        name='Global group 1'
                    />

                    <ChatSelectButton
                        name='Global group 2'
                    />

                    {/* Direct messaging */}
                    <MenuTitle title='Direct' />

                    <ChatSelectButton
                        name='Jakke'
                    />

                    <ChatSelectButton
                        name='Sepi'
                    />

                </Hidden>
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

                <ChatHeader name='Jakke' online={true} />
                <Chat messages={messages} />
                {/* <ChatInput /> */}
                
            </Grid>
                
        </Grid>
    )

}


export default ChatPage