import { createContext, useEffect, useState } from "react"
import { initialLoginFormData, initialRegisterFormData } from "@/config"
import { login, register, verify } from '../../services/index'


export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
    const [loginFormData, setLoginFormData] = useState(initialLoginFormData)
    const [registerFormData, setRegisterFormData] = useState(initialRegisterFormData)
    const [auth, setAuth] = useState({})

    async function handleRegister(event) {
        event.preventDefault()
        const data = await register(registerFormData)
    }
    
    async function handleLogin(event) {
        event.preventDefault()
        const { data } = await login(loginFormData)

        if (data.user && data.accessToken) {
            sessionStorage.setItem('accessToken', data.accessToken)
            setAuth({
                user: data.user,
                authenticated: true
            })
        } else {
            setAuth({
                user: null,
                authenticated: false
            })
        }
    }

    async function authenticate() {
        const { data } = await verify()

        if (data.user) {
            setAuth({
                user: data.user,
                authenticated: true
            })
        } else {
            setAuth({
                user: null,
                authenticated: false
            })
        }
    }

    useEffect(() => {
        authenticate()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                loginFormData,
                setLoginFormData,
                registerFormData,
                setRegisterFormData,
                handleRegister,
                handleLogin
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
