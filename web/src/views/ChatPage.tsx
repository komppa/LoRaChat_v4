import React, { useEffect } from 'react'
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
import { useSelector, shallowEqual } from 'react-redux'
import { setCurrentMenu } from '../state/reducers/menuReducer'
import { sendMessage, connectWsServer, disconnectWsServer } from '../state/reducers/messageReducer'
import { User } from '../state/reducers/userReducer'
import { useAppDispatch } from '../state/store'


const ChatPage = () => {

    const dispatch = useAppDispatch()
    const selectedContact = useSelector((state: any) => state.menu)
    const messages = useSelector((state: any) => state.message, shallowEqual)
    const users = useSelector((state: any) => state.user, shallowEqual)

    const currentUsername = useSelector((state: any) => state.login.username)
    const connectionStatus = useSelector((state: any) => state.connection.status)

    const handleMessageSend = (newMessage: { to: string, content: string }) => {
        dispatch(sendMessage(newMessage))
    }

    // Create a connection to websocket server 
    useEffect(() => {

        dispatch(connectWsServer())

        return () => {
            dispatch(disconnectWsServer())
        }

    }, [])

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

                    {/* TODO fix me */}
                    <br />

                    <MyAvatar
                        username={currentUsername}
                        connection={connectionStatus}
                    />

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
                        selected={selectedContact == 'Global chat group 1' ? true : false}
                        online={null}
                        rssi={null}
                        onClick={() => dispatch(setCurrentMenu('Global chat group 1'))}
                    />

                    <ChatSelectButton
                        name='Global chat group 2'
                        selected={selectedContact == 'Global chat group 2' ? true : false}
                        online={null}
                        rssi={null}
                        onClick={() => dispatch(setCurrentMenu('Global chat group 2'))}
                    />

                    {/* Direct messaging */}
                    <MenuTitle title='Direct' />

                    {
                        users.map((user: User) => (
                            <ChatSelectButton
                                key={ user.id }
                                name={ user.username }
                                selected={selectedContact === user.username ? true : false}
                                online={user.online}
                                rssi={user.rssi}
                                onClick={() => dispatch(setCurrentMenu(user.username))}
                            />
                        ))
                    }

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
                    <ChatHeader name={selectedContact} online={true} onLogout={() => null} />
                    <Chat selectedContact={selectedContact} messages={messages} />
                    <ChatInput selectedContact={selectedContact} onSubmit={handleMessageSend} />
                </Box>

            </Grid>
                
        </Grid>
    )

}


export default ChatPage