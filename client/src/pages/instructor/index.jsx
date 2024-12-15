import { Button } from "@/components/ui/button"
import { BarChart, Book, LogOut } from "lucide-react"
import InstructorDashboard from "@/components/instructor-view/dashboard"
import InstructorCourses from "@/components/instructor-view/courses"


function InstructorView() {

    const menuItems = [
        {
            icon: BarChart,
            label: 'Dashboard',
            value: 'dashboard',
            component: <InstructorDashboard />
        },
        {
            icon: Book,
            label: 'Courses',
            value: 'courses',
            component: <InstructorCourses />
        },
        {
            icon: LogOut,
            label: 'Logout',
            value: 'logout',
            component: null
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Instructor Dashboard</h2>
                    <nav>
                        { menuItems.map(item => (
                            <Button key={item.value} className="w-full justify-start mb-2">
                                <item.icon className="mr-2 h-4 w-4" />
                                { item.label }
                            </Button>
                        ))}
                    </nav>
                </div>
            </aside>
        </div>
    )
}

export default InstructorView