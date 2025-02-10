import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { GraduationCap } from "lucide-react"
import { AuthContext } from "@/context/auth"
import { loginFormControls, registerFormControls } from "@/config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CommonForm from "@/components/common-form"


const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login')
    
    const {
        loginFormData,
        setLoginFormData,
        registerFormData,
        setRegisterFormData,
        handleRegister,
        handleLogin,
    } = useContext(AuthContext)

    function handleTabChange(value) {
        setActiveTab(value)
    }

    function isLoginValid() {
        return (
            loginFormData
            && loginFormData.email !== ''
            && loginFormData.password !== ''
        )
    }

    function isRegisterValid() {
        return (
            registerFormData
            && registerFormData.email !== ''
            && registerFormData.username !== ''
            && registerFormData.password !== ''
        )
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-center min-h-[85vh] bg-background">
                <Tabs
                    value={activeTab}
                    defaultValue="login"
                    onValueChange={handleTabChange}
                    className="w-full max-w-md"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Sign In</TabsTrigger>
                        <TabsTrigger value="register">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Card className="p-6 space-y-6">
                            <CardHeader className="flex items-center font-medium">
                                <CardTitle className="flex flex-col items-center">
                                    <GraduationCap className="w-8 h-8 mr-2 transition ease-in-out hover:scale-110" />
                                    <span className="font-bold text-lg lg:text-xl">
                                        Easy Programming
                                    </span>
                                </CardTitle>
                                <CardDescription>
                                    Log in to your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CommonForm
                                    buttonText={'Login'}
                                    formControls={loginFormControls}
                                    formData={loginFormData}
                                    setFormData={setLoginFormData}
                                    isButtonDisabled={!isLoginValid()}
                                    handleSubmit={handleLogin}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="register">
                        <Card className="p-6 space-y-6">
                            <CardHeader className="flex items-center font-medium">
                                <CardTitle className="flex flex-col items-center">
                                    <GraduationCap className="w-8 h-8 mr-2 transition ease-in-out hover:scale-110" />
                                    <span className="font-bold text-lg lg:text-xl">
                                        Easy Programming
                                    </span>
                                </CardTitle>
                                <CardDescription>
                                    Create a new account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CommonForm
                                    buttonText={'Register'}
                                    formControls={registerFormControls}
                                    formData={registerFormData}
                                    setFormData={setRegisterFormData}
                                    isButtonDisabled={!isRegisterValid()}
                                    handleSubmit={handleRegister}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default AuthPage