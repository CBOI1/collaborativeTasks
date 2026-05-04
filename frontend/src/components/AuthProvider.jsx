import { useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { redirect } from "react-router-dom";

function AuthProvider({children}) {
    console.log("AuthProvider mounted");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)
    //fetch user status on mount
    const login = async (credentials) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(credentials)
        })
        if (!res.ok) {
            throw new Error('Error: Login failed');
        }
        const {user} = await res.json();
    }

    const logout = async () => {
        const res = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
    }

    return <AuthContext.Provider value={{user, loading, login, setUser}}>
        {children}
    </AuthContext.Provider>
    
}

export default AuthProvider;