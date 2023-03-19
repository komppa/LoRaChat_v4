import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
import { Circle } from '@mui/icons-material'


interface ChatHeaderProps {
    name: string;
    online: boolean;
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


interface Message {
  sender: string;
  content: string;
  isCurrentUser: boolean;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatBubble: React.FC<Message> = ({ sender, content, isCurrentUser }) => {
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
                { sender }
            </Typography>
            <Typography variant="body1">
                { content }
            </Typography>
        </Box>
    )
}

export const Chat: React.FC<ChatWindowProps> = ({ messages }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                padding: '1rem',
            }}
        >
            {
                messages.map((message, index) => (
                    <ChatBubble key={index} {...message} />
                ))
            }
        </Box>
    )
}