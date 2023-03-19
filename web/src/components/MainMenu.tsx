import React from 'react'
import {
    List,
} from '@mui/material'
import '../index.css'
import { MenuTitle, MenuButton } from './MenuListButton'


const MainMenu = () => {

    return (
        <List sx={{ mt: 4 }}>

            <MenuTitle title='Chat' />
            <MenuButton title='All messages' onClick={() => console.log('Clicked All messages')} />
            <MenuButton title='Unread messages' onClick={() => console.log('Clicked Unread messages')} />
            <MenuButton title='Annoucements' onClick={() => console.log('Clicked Annoucements')} />

            <MenuTitle title='Network' />
            <MenuButton title='Sensors' onClick={() => console.log('Clicked Sensors')} />
            <MenuButton title='Offnet' onClick={() => console.log('Clicked Offnet')} />

            <MenuTitle title='General' />
            <MenuButton title='Help' onClick={() => console.log('Clicked Help')} />
            <MenuButton title='Settings' onClick={() => console.log('Clicked Settings')} />

        </List>
    )

}


export default MainMenu