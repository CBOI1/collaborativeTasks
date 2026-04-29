import { useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";

function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    //fetch user status on mount
    useEffect(() => {
        const controller = new AbortController();
        async function fetchUser() {
            console.log("effect ran")
            //reqHeaders.append();
            try {
                const response = await fetch('/api/me', {
                    credentials: "include",
                    
                });
                const data = await response.json();
                setUser(data.user);
            } catch(err) {
                console.log("clean up ")
                console.log("Fetch error: " + err.message);
            }
        }
        fetchUser();
        return () => {
            controller.abort();
        }
    }, []);
    return <AuthContext.Provider value={{user, setUser}}>
        {children}
    </AuthContext.Provider>
    
}

export default AuthProvider;