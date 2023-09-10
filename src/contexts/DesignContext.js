import React, { createContext } from 'react'
import { ThemeProvider, createTheme } from '@mui/material';

export const DesignContext = createContext();



export default function DesignProvider({ children }) {
    const palette = {
        templatePrimaryColor: '#282b33',
        sidebarPrimaryColor: '#ffffff',
        backgrondColor: '##f2f3f7',
        primaryColor: '#282b33',
        secondaryColor: '#ce011f',
        btnPrimaryColor: '#0099a7',
        btunTextPrimaryColor: '#0099a7',
        textPrimaryColor: '#373f51',
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: palette.primaryColor, // Lighter color from the gradient
                light: '#a66dff', // Hover gradient color
                dark: '#6b47d1', // Active gradient color
            },
            secondary: {
                main: palette.secondaryColor, // Darker color from the gradient
                light: '#6c3af2', // Hover gradient color
                dark: '#4217b2', // Active gradient color
            },
        },
    })
    return (
        <DesignContext.Provider value={{ palette }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </DesignContext.Provider>
    )
}
