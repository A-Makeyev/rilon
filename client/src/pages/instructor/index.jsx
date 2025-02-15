import { AuthContext } from "@/context/auth"
import { InstructorContext } from "@/context/instructor"
import { useContext, useEffect, useState } from "react"
import { getInstructorCourses } from "@/services"
import { Button } from "@/components/ui/button"
import { BarChart, Book, LogOut } from "lucide-react"
import { Tabs, TabsContent } from "@radix-ui/react-tabs"
import InstructorDashboard from "@/components/instructor-view/dashboard"
import InstructorCourses from "@/components/instructor-view/courses"


function InstructorView() {
    const { auth, logout } = useContext(AuthContext)
    const { instructorCourses, setInstructorCourses } = useContext(InstructorContext)
    const [activeTab, setActiveTab] = useState('dashboard')
    const menuItems = [
        {
            icon: BarChart,
            label: 'Dashboard',
            value: 'dashboard',
            component: <InstructorDashboard courses={instructorCourses} />
        },
        {
            icon: Book,
            label: 'Courses',
            value: 'courses',
            component: <InstructorCourses courses={instructorCourses} />
        },
        {
            icon: LogOut,
            label: 'Logout',
            value: 'logout',
            component: null
        },
    ]

    function handleLogout() {
        logout()
    }

    async function getCourses() {
        const response = await getInstructorCourses()
        if (response?.success) {
            setInstructorCourses(response?.data)
        }
    }

    useEffect(() => {
        getCourses()
    }, [])

    return (
        <div className="flex h-full min-h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4 text-center capitalize">
                        { auth.user.username }
                    </h2>
                    <nav>
                        { menuItems.map(item => (
                            <Button
                                key={item.value}
                                variant={activeTab === item.value ? 'secondary' : 'ghost'}
                                className="w-full justify-start mb-2"
                                onClick={item.value === 'logout' ? handleLogout : () => setActiveTab(item.value)}
                            >
                                <item.icon className="h-4 w-4" />
                                { item.label }
                            </Button>
                        ))}
                    </nav>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 ml-4">
                        Instructor Dashboard
                    </h1>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        { menuItems.map(item => (
                            <TabsContent key={item.value} value={item.value}>
                                { item.component !== null && item.component }
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </main>
        </div>
    )
}

export default InstructorView