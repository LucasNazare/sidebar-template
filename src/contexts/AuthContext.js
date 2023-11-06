import React, { createContext, useEffect, useState } from 'react'
import LoadingOverlay from '../templates/LoadingOverlay'
import axios from 'axios';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [userJwt, setUserJwt] = useState(null);
    const [loading, setLoading] = useState(true);


    const logout = () => {
        setToken(null);
        setUserJwt(null);
        localStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = null;
    }

    useEffect(() => {
        let t = localStorage.getItem('token');
        if (t) {
            setToken(t);

            //decode jwt
            let base64Url = t.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            setUserJwt(JSON.parse(jsonPayload));

            axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
        }
        setLoading(false);
    }, [])

    if (loading) return <LoadingOverlay />

    return (
        <AuthContext.Provider value={{ token, setToken, userJwt, setUserJwt, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
