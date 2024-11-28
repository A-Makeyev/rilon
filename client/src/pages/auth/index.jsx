import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { GraduationCap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loginFormControls, registerFormControls } from "@/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthContext } from "@/context/auth"
import CommonForm from "@/components/common-form"

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login')
    const {
        loginFormData,
        setLoginFormData,
        registerFormData,
        setRegisterFormData,
        handleRegister
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
        <div className="flex flex-col min-h-screen">
            <header className="flex items-center border-b px-4 lg:px-6 h-14">
                <Link to={"/"} className="flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 mr-4" />
                    <span className="font-extrabold text-xl">Easy Programming</span>
                </Link>
            </header>
            <div className="flex items-center justify-center min-h-screen bg-background">
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
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle className="text-center">Sign in to your account</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CommonForm
                                    formControls={loginFormControls}
                                    buttonText={'Sign In'}
                                    formData={loginFormData}
                                    setFormData={setLoginFormData}
                                    isButtonDisabled={!isLoginValid()}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="register">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle className="text-center">Create a new account</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CommonForm
                                    formControls={registerFormControls}
                                    buttonText={'Sign Up'}
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