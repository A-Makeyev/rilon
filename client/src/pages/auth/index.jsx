import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { GraduationCap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signInFormControls, signUpFormControls } from "@/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthContext } from "@/context"
import CommonForm from "@/components/common-form"

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('signin')
    const {                
        signInFormData, 
        setSignInFormData,
        signUpFormData, 
        setSignUpFormData
    } = useContext(AuthContext)

    function handleTabChange(value) {
        setActiveTab(value)
    }

    function isSignInValid() {
        return (
            signInFormData 
            && signInFormData.email !== '' 
            && signInFormData.password !== ''
        )
    }

    function isSignUpValid() {
        return (
            signUpFormData 
            && signUpFormData.email !== '' 
            && signUpFormData.username !== '' 
            && signUpFormData.password !== ''
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
                    defaultValue="signin"
                    onValueChange={handleTabChange}
                    className="w-full max-w-md"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Sign in to your account</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                            <CommonForm 
                                formControls={signInFormControls}
                                 buttonText={'Sign In'}
                                 formData={signInFormData}
                                 setFormData={setSignInFormData}
                                 isButtonDisabled={!isSignInValid()}
                            />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Create a new account</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                            <CommonForm 
                                formControls={signUpFormControls}
                                    buttonText={'Sign Up'}
                                    formData={signUpFormData}
                                    setFormData={setSignUpFormData}
                                    isButtonDisabled={!isSignUpValid()}
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