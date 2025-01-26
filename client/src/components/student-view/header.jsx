import { useContext } from "react"
import { AuthContext } from "@/context/auth"
import { Link } from "react-router-dom"
import { GraduationCap, TvMinimalPlay } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"


function StudentHeader() {
    const { logout } = useContext(AuthContext)

    function handleLogout() {
        logout()
    }

    return (
        <header className="flex items-center justify-between p-4 border-b relative">
            <div className="flex items-center space-x-4">
                <Link to="/home" className="flex items-center hover:text-slate-800">
                    <GraduationCap className="w-8 h-8 mr-4 transition ease-in-out hover:scale-110" />
                    <span className="font-extrabold text-xl">Easy Programming</span>
                </Link>
                <div className="flex items-center space-x-1">
                    <Button className="text-base md:text-lg font-medium">
                        Explore Courses
                    </Button>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex gap-2 items-center">
                    <div className="flex items-center flex-col">
                    <Button >
                        <TvMinimalPlay className="h-4 w-4" /> 
                        Courses
                    </Button>
                    </div>
                    <Button onClick={handleLogout}>
                        <LogOut className="h-4 w-4" /> 
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default StudentHeader