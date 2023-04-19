import React from 'react'
import {
    ListItem,
    ListItemText,
    ListItemButton,
} from '@mui/material'


interface MenuButtonProps{
    title: string,
    selected: boolean,
    onClick: () => void,
    disabled?: boolean
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

export const MenuButton: React.FC<MenuButtonProps> = ({ title, selected, onClick, disabled = false }) => (
    <ListItemButton
        sx={{
            paddingLeft: 6,
            paddingBottom: 2.5,
            backgroundColor: selected ? '#353d46' : '',
            '&:hover': {
                backgroundColor: 'rgba(53, 61, 70, 0.33)',
            },
        }}
        onClick={() => {
            // Do not allow clicking if disabled
            if (disabled) {
                return
            }
            onClick()
        }}
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