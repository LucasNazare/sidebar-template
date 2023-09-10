import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import PageLayout from './MainMenu/PageLayout';
import Login from '../pages/Login/Login';

export default function LoggedInWrapper({ children }) {
    const { token } = useContext(AuthContext);

    if (!token) return <Login />
    return (
        <PageLayout>{children}</PageLayout>
    )
}
