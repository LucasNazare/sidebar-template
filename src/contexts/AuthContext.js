import React, { createContext, useEffect, useState } from 'react'
import LoadingOverlay from '../templates/LoadingOverlay'

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [userJwt, setUserJwt] = useState(null);
    const [loading, setLoading] = useState(true);


    const logout = () => {
        setToken(null);
        setUserJwt(null);
        localStorage.removeItem('token');
    }

    useEffect(() => {
        let t = localStorage.getItem('token');
        if (t)
            setToken(t)

        setLoading(false);
    }, [])

    if (loading) return <LoadingOverlay />

    return (
        <AuthContext.Provider value={{ token, setToken, userJwt, setUserJwt, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
