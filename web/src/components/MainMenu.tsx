import React from 'react'
import {
    List,
} from '@mui/material'
import '../index.css'
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
            <MenuButton title='Unread messages' selected={isSelected('/unread')} onClick={() => navigate('/unread')} />
            <MenuButton title='Announcements' selected={isSelected('/announcements')} onClick={() => navigate('/announcements')} />

            <MenuTitle title='Network' />
            <MenuButton title='Sensors' selected={isSelected('/sensors')} onClick={() => navigate('/sensors')} />
            <MenuButton title='Offnet' selected={isSelected('/offnet')} onClick={() => navigate('/offnet')} />

            <MenuTitle title='General' />
            <MenuButton title='Help' selected={isSelected('/help')} onClick={() => navigate('/help')} />
            <MenuButton title='Settings' selected={isSelected('/settings')} onClick={() => navigate('/settings')} />

        </List>
    )

}


export default MainMenu