import { Menu } from '@mui/icons-material'
import { Drawer, Grid, IconButton } from '@mui/material'
import logo from '../../../assets/imgs/victory.png'
import React, { useState } from 'react'
import SidebarDesktop from './SidebarDesktop'

export default function Navbar({ sticky }) {

    const [menuOpen, setMenuOpen] = useState(false)
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setMenuOpen(open)
    }

    return (
        <Grid container alignItems={'center'} justifyContent={'space-between'} style={{ padding: '10px', backgroundColor: 'white', position: 'sticky', top: 0 }}>
            <Grid item>
                <IconButton>
                    <Menu onClick={() => setMenuOpen(true)} />
                </IconButton>
            </Grid>
            <Grid item>
                <img src={logo} width='100px' />
                <Drawer
                    open={menuOpen}
                    anchor='left'
                    onClose={toggleDrawer(false)}
                >
                    <SidebarDesktop mobile />
                </Drawer>
            </Grid>
        </Grid>
    )
}

