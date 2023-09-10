import { Grid, Hidden } from '@mui/material'
import React from 'react'
import SidebarDesktop from './components/SidebarDesktop'
import Navbar from './components/Navbar';

export default function PageLayout({ children, title }) {
    const sidebarWidth = "250px"; // fixed width for the sidebar

    return (
        <Grid container>
            <Hidden smDown>
                <Grid item style={{ flex: `0 0 ${sidebarWidth}`, width: sidebarWidth }}>
                    <SidebarDesktop />
                </Grid>
            </Hidden>
            <Hidden smUp>
                <Navbar />
            </Hidden>
            <Grid item style={{ flex: 1 }}>
                <div style={{ padding: '20px 20px 20px 20px' }}>
                    {children}
                </div>
            </Grid>

        </Grid>
    )
}
