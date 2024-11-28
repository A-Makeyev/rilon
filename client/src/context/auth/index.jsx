import { createContext, useState } from "react"
import { initialLoginFormData, initialRegisterFormData } from "@/config"
import { register } from '../../services/index'


export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
    const [loginFormData, setLoginFormData] = useState(initialLoginFormData)
    const [registerFormData, setRegisterFormData] = useState(initialRegisterFormData)

    async function handleRegister(event) {
        event.preventDefault()

        const data = await register(registerFormData)
    }

    return (
        <AuthContext.Provider
            value={{
                loginFormData,
                setLoginFormData,
                registerFormData,
                setRegisterFormData,
                handleRegister
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
