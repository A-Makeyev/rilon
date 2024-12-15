import { createContext, useEffect, useState } from "react"
import { initialLoginFormData, initialRegisterFormData } from "@/config"
import { login, register, verify } from '../../services/index'
import { Skeleton } from "@/components/ui/skeleton"


export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
    const [loginFormData, setLoginFormData] = useState(initialLoginFormData)
    const [registerFormData, setRegisterFormData] = useState(initialRegisterFormData)
    const [auth, setAuth] = useState({ user: null, isAuthenticated: false })
    const [loading, setLoading] = useState(true)

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
                isAuthenticated: true
            })
            setLoading(false)
        } else {
            setAuth({
                user: null,
                isAuthenticated: false
            })
            setLoading(false)
        }
    }

    async function authenticate() {
        try {
            const { data } = await verify()

            if (data.user) {
                setAuth({
                    user: data.user,
                    isAuthenticated: true
                })
            } else {
                setAuth({
                    user: null,
                    isAuthenticated: false
                })
            }
        } catch (err) {
            if (!err?.response?.data?.success) {
                setAuth({
                    user: null,
                    isAuthenticated: false
                })
            }
            setLoading(false)
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
                handleLogin,
                auth
            }}
        >
            { loading ? <Skeleton /> : children }
        </AuthContext.Provider>
    )
}
