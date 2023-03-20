import React from 'react'
import {
    CssBaseline,
    Grid,
    Hidden,
    Divider,
    Box,
} from '@mui/material'
import MyAvatar from '../components/MyAvatar'
import MainMenu from '../components/MainMenu'
import SearchBar from '../components/SearchBar'
import { MenuTitle } from '../components/MenuListButton'
import ChatSelectButton from '../components/ChatSelectButton'
import { ChatHeader, Chat, ChatInput } from '../components/Chat'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { setCurrentMenu } from '../state/reducers/menuReducer'
import { addMessages } from '../state/reducers/messageReducer'

const ChatPage = () => {

    const dispatch = useDispatch()
    const selectedContact = useSelector((state: any) => state.menu)
    const messages = useSelector((state: any) => state.message, shallowEqual)


    // Setup your WebSocket connection here
    const websocket = new WebSocket('ws://localhost:8080')

    websocket.onmessage = (event) => {
        
        const payload = JSON.parse(event.data)

        // eslint-disable-next-line no-prototype-builtins
        if (payload.hasOwnProperty('type') && payload.type === 'messages') {
            dispatch(addMessages(payload.data))
        }
    }

    // const messages = [
    //     {
    //         sender: 'Jakke',
    //         content: 'Hello!',
    //         isCurrentUser: false,
    //     },
    //     {
    //         sender: 'K',
    //         content: 'Hello, World!\\n',
    //         isCurrentUser: true,
    //     },
    //     {
    //         sender: 'Jakke',
    //         content: 'Great!',
    //         isCurrentUser: false,
    //     },
    // ]


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
                        name='Global chat group 1'
                        selected={selectedContact == 'G1' ? true : false}
                        onClick={() => dispatch(setCurrentMenu('G1'))}
                    />

                    <ChatSelectButton
                        name='Global chat group 2'
                        selected={selectedContact == 'G2' ? true : false}
                        onClick={() => dispatch(setCurrentMenu('G2'))}
                    />

                    {/* Direct messaging */}
                    <MenuTitle title='Direct' />

                    <ChatSelectButton
                        name='Jakke'
                        selected={false}
                        onClick={() => console.log('123')}
                    />

                    <ChatSelectButton
                        name='Sepi'
                        selected={false}
                        onClick={() => console.log('123')}
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
                
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                    }}
                >
                    <ChatHeader name="Jakke" online={true} />
                    <Chat messages={messages} />
                    <ChatInput />
                </Box>

                
            </Grid>
                
        </Grid>
    )

}


export default ChatPage