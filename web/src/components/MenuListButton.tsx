import React from 'react'
import {
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemButton,
} from '@mui/material'


interface MenuButtonProps{
    title: string,
    selected: boolean,
    onClick: (route: string) => void,
}

const menuStyle = {
    color: 'white',
    fontWeight: 'bold',
}

export const MenuTitle = (props: { title: string }) => (
    <ListItem sx={{ cursor: 'default', paddingBottom: 2.5 }}>
        <ListItemText
            primary={ props.title }
            primaryTypographyProps={{
                style: menuStyle,
                sx: { fontSize: theme => theme.spacing(3) } 
            }}
        />
    </ListItem>
)

export const MenuButton: React.FC<MenuButtonProps> = ({ title, selected, onClick }) => (
    <ListItemButton
        sx={{
            paddingLeft: 6,
            paddingBottom: 2.5,
            backgroundColor: selected ? '#353d46' : '',
            '&:hover': {
                backgroundColor: 'rgba(53, 61, 70, 0.33)',
            },
        }}
        onClick={() => onClick('Menu Button 1.1')}
    >
        <ListItemText
            primary={ title }
            primaryTypographyProps={{
                style: menuStyle,
                sx: {
                    fontSize: theme => theme.spacing(2.5),
                }
            }}
        />
    </ListItemButton>
)