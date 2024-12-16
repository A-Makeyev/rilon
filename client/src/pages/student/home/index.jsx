import { useContext } from "react"
import { AuthContext } from "@/context/auth"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"


function StudentHomePage() {
    const { logout } = useContext(AuthContext)

    function handleLogout() {
        logout()
    }

    return (
        <div>
            StudentHomePage
            <Button onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> 
                Logout
            </Button>
        </div>
    )
}

export default StudentHomePage