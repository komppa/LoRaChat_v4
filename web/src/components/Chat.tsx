import React, { useState, useEffect } from 'react'
// import { SystemProps } from '@mui/system'
import { InputBase, Box, IconButton, Typography } from '@mui/material'
import { Clear as  ClearIcon, Circle } from '@mui/icons-material'
import { Message } from '../state/reducers/messageReducer'


interface ChatHeaderProps {
    name: string
    online: boolean
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ name, online }) => {

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                backgroundColor: '#282e35',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    marginLeft: '3rem',
                    marginRight: '2rem',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.5rem',
                }}
            >
                { name }
            </Typography>
            <Circle
                sx={{
                    marginRight: '0.5rem',
                    fontSize: '1rem',
                    color: online ? 'green' : 'gray',
                }}
            />
            <Typography
                variant="body1"
                sx={{ color: 'white' }}
            >
                {
                    online ? 'Online' : 'Offline'
                }
            </Typography>
        </Box>
    )

}


interface ChatWindowProps {
  messages: Message[]
  selectedContact: string // Username of the user or 'G1' or 'G2' for global chat groups
}

// interface ChatWindowProps extends SystemProps {
//     messages: Message[];
// }

const ChatBubble: React.FC<Message> = ({ from, content, isCurrentUser }) => {
    return (
        <Box
            sx={{
                maxWidth: '80%',
                alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '0.75rem',
                margin: '0.5rem',
            }}
        >
            <Typography variant="subtitle2" fontWeight="bold">
                { from }
            </Typography>
            <Typography variant="body1">
                { content }
            </Typography>
        </Box>
    )
}

export const Chat: React.FC<ChatWindowProps> = ({ messages, selectedContact }) => {

    const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

    useEffect(() => {

        const filtered = messages.filter(message => message.from === selectedContact || (message.from === 'Me' && message.to === selectedContact))
        setFilteredMessages(filtered)

    }, [messages, selectedContact])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                padding: '1rem',
                flexGrow: 1,
            }}
        >
            {
                filteredMessages.map((message, index) => (
                    <ChatBubble key={index} {...message} />
                ))
            }
        </Box>
    )
}

export const ChatInput = () => {
    
    
    const [messageInput, setMessageInput] = useState('')
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(event.target.value)
    }
    
    const handleClear = () => setMessageInput('')
    
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50px',
                backgroundColor: '#465260',
                padding: '0.5rem',
                paddingLeft: '1rem',
                width: '90%',
                margin: '2rem auto',    // TODO fix 2rem
                color: '#848484',
            }}
        >
            <InputBase
                value={ messageInput }
                onChange={ handleChange }
                placeholder="Type your message here"
                sx={{
                    marginLeft: '0.5rem',
                    flexGrow: 1,
                    color: 'white',
                }}
            />
            {
                messageInput && (
                    <IconButton onClick={ handleClear } size="small">
                        <ClearIcon sx={{ color: '#848484' }} />
                    </IconButton>
                )
            }
        </Box>
    )
    

}