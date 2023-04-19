import React from 'react'
import {
    List,
} from '@mui/material'
import { MenuTitle, MenuButton } from './MenuListButton'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'


const MainMenu = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const isSelected = (pathname: string) => location.pathname == pathname ? true : false

    return (
        <List sx={{ mt: 4 }}>

            <MenuTitle title='Chat' />
            <MenuButton title='All messages' selected={isSelected('/')} onClick={() => navigate('/')} />
            <MenuButton title='Unread messages' selected={isSelected('/unread')} onClick={() => navigate('/unread')} disabled />
            <MenuButton title='Announcements' selected={isSelected('/announcements')} onClick={() => navigate('/announcements')} disabled />

            <MenuTitle title='Network' />
            <MenuButton title='Sensors' selected={isSelected('/sensors')} onClick={() => navigate('/sensors')} disabled />
            <MenuButton title='Offnet' selected={isSelected('/offnet')} onClick={() => navigate('/offnet')} disabled />

            <MenuTitle title='General' />
            <MenuButton title='Help' selected={isSelected('/help')} onClick={() => navigate('/help')} disabled />
            <MenuButton title='Settings' selected={isSelected('/settings')} onClick={() => navigate('/settings')} disabled />

        </List>
    )

}


export default MainMenu