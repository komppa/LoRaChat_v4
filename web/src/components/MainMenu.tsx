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
            <MenuButton title='Annoucements' selected={isSelected('/announcements')} onClick={() => console.log('Clicked Annoucements')} />

            <MenuTitle title='Network' />
            <MenuButton title='Sensors' selected={isSelected('/sensors')} onClick={() => console.log('Clicked Sensors')} />
            <MenuButton title='Offnet' selected={isSelected('/offnet')} onClick={() => console.log('Clicked Offnet')} />

            <MenuTitle title='General' />
            <MenuButton title='Help' selected={isSelected('/help')} onClick={() => console.log('Clicked Help')} />
            <MenuButton title='Settings' selected={isSelected('/settings')} onClick={() => console.log('Clicked Settings')} />

        </List>
    )

}


export default MainMenu