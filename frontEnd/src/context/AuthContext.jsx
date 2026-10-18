import { createContext, useContext, useState } from "react";
import { login as userLogin } from "../services/apiAuth"

const AuthContext = createContext()

function AuthProvider({ children }) {

    const [token, setToken] = useState(() => localStorage.getItem("token") || "")
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user")
        return storedUser ? JSON.parse(storedUser) : null
    })


    const login = async (details) => {
        const data = await userLogin(details);
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("user", JSON.stringify({
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
        }))

        setToken(data.data.token);
        setUser({
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
        });
        return data
    };

    const logout = () => {
        setToken("")
        setUser(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")

    }
    return <AuthContext.Provider value={{ user, token, login, logout }}>
        {children}
    </AuthContext.Provider>
}

function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("Must be used within authprovider")
    }
    return context
}

export { AuthProvider, useAuth }

