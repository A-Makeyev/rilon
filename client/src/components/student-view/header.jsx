import { useContext } from "react"
import { AuthContext } from "@/context/auth"
import { Link, useNavigate } from "react-router-dom"
import { GraduationCap, Telescope, TvMinimalPlay } from "lucide-react"
import { Tooltip } from "react-tooltip"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"


function StudentHeader() {
    const navigate = useNavigate()
    const { logout } = useContext(AuthContext)

    function handleLogout() {
        logout()
    }

    return (
        <header className="flex items-center justify-between sticky top-0 p-4 bg-white border-b shadow-sm">
            <div className="flex items-center space-x-4">
                <Link to="/home" className="flex items-center ml-4 hover:text-gray-800 transition">
                    <GraduationCap className="w-8 h-8 mr-4 transition ease-in-out hover:scale-110" />
                    <span className="font-bold text-lg lg:text-xl">Easy Programming</span>
                </Link>
            </div>
            <div className="flex items-center space-x-4 mr-4">
                <div className="flex gap-4 items-center">
                    <Button variant="outline" onClick={() => navigate('/courses')}>
                        <Telescope />
                        Explore Courses
                    </Button>
                    <TvMinimalPlay onClick={() => navigate('/acquired-courses')} data-tooltip-id="my-courses" className="w-6 h-6 cursor-pointer transition ease-in-out hover:scale-110" /> 
                    <LogOut onClick={handleLogout} data-tooltip-id="logout" className="w-6 h-6 cursor-pointer transition ease-in-out hover:scale-110" />
                </div>
            </div>
            <Tooltip
                id="logout"
                place="bottom"
                content="Logout"
                className="font-medium"
            />
            <Tooltip
                id="my-courses"
                place="bottom"
                content="My Courses"
                className="font-medium"
            />
        </header>
    )
}

export default StudentHeader