import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/context/auth"
import { InstructorContext } from "@/context/instructor"
import { getInstructorCourses } from "@/services"
import { ChartNoAxesCombined, Atom, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Tooltip } from "react-tooltip"
import InstructorDashboard from "@/components/instructor-view/dashboard"
import InstructorCourses from "@/components/instructor-view/courses"


function InstructorView() {
    const { auth, logout } = useContext(AuthContext)
    const { instructorCourses, setInstructorCourses } = useContext(InstructorContext)
    const [activeTab, setActiveTab] = useState('dashboard')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    
    const menuItems = [
        {
            icon: ChartNoAxesCombined,
            label: 'Dashboard',
            value: 'dashboard',
            component: <InstructorDashboard courses={instructorCourses} />
        },
        {
            icon: Atom,
            label: 'Courses',
            value: 'courses',
            component: <InstructorCourses courses={instructorCourses} />
        },
        {
            icon: LogOut,
            label: 'Logout',
            value: 'logout',
            component: null
        }
    ]

    function handleMenuItemClick(item) {
        if (item.value === 'logout') {
            logout()
        } else {
            setActiveTab(item.value)
            setMobileMenuOpen(false)
        }
    }

    function toggleMobileMenu() {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    function toggleSidebar() {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    async function getCourses() {
        try {
            const response = await getInstructorCourses()
            if (response?.success) {
                setInstructorCourses(response.data)
            }
        } catch (error) {
            console.error("Failed to fetch instructor courses:", error)
        }
    }

    useEffect(() => {
        getCourses()
    }, [])

    return (
        <div className="flex flex-col md:flex-row h-full min-h-screen bg-gray-100">
            <header className="bg-white shadow-md p-4 flex justify-between items-center md:hidden">
                <h2 className="text-xl font-bold capitalize">
                    { auth.user.username }
                </h2>
                <div className="flex space-x-2">
                    { menuItems.map(item => (
                        <Button
                            key={item.value}
                            title={sidebarCollapsed ? item.label : null}
                            variant={activeTab === item.value ? 'outline' : 'transparent'}
                            className="w-full mb-2"
                            data-tooltip-id={item.label}
                            onClick={() => handleMenuItemClick(item)}
                        >
                            <item.icon className="h-4 w-4" />
                            <span className="hidden sm:flex ml-2 ">
                                { item.label }
                            </span>
                        </Button>
                    ))}
                </div>
            </header>
            { mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="p-4 flex flex-col space-y-2">
                        { menuItems.map(item => (
                            <Button
                                key={item.value}
                                variant={activeTab === item.value ? 'outline' : 'transparent'}
                                className="w-full justify-start"
                                onClick={() => handleMenuItemClick(item)}
                            >
                                <item.icon className="h-4 w-4 mr-2" />
                                { item.label }
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} hidden md:block bg-white shadow-md transition-all duration-300`}>
                <div className="p-4 mt-5">                    
                    <div className="flex mb-4">
                        <Button 
                            variant="transparent" 
                            className={sidebarCollapsed ? 'w-full' : null}
                            onClick={toggleSidebar} 
                        >
                            { sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" /> }
                        </Button>
                        { !sidebarCollapsed && (
                            <h2 className="text-2xl font-bold mb-3 text-center capitalize">
                                { auth.user.username }
                            </h2>
                        )}
                    </div>
                    <nav>
                        { menuItems.map(item => (
                            <Button
                                key={item.value}
                                variant={activeTab === item.value ? 'outline' : 'transparent'}
                                className={`justify-${sidebarCollapsed ? 'center' : 'start'} w-full mb-2`}
                                data-tooltip-id={`sidebar-${item.label}`}
                                onClick={() => handleMenuItemClick(item)}
                            >
                                <item.icon className="h-4 w-4" />
                                { !sidebarCollapsed && (
                                    <span className="ml-2">
                                        { item.label }
                                    </span>
                                )}
                            </Button>
                        ))}
                    </nav>
                </div>
            </aside>
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center lg:text-left text-xl lg:text-3xl mt-5 md:mt-0 mb-10">
                        <h1 className="text-center md:text-left text-2xl sm:text-3xl font-bold">
                            Instructor Dashboard
                        </h1>
                    </div>
                    
                    <Tabs value={activeTab}>
                        { menuItems.filter(item => item.component !== null).map(item => (
                            <TabsContent key={item.value} value={item.value}>
                                { item.component }
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </main>
            { menuItems.map(item => (
                <>
                    <Tooltip
                        id={item.label}
                        content={item.label}
                        className={`${sidebarCollapsed ? 'flex' : 'hidden'} flex sm:hidden font-medium`}
                    />  
                    <Tooltip
                        id={`sidebar-${item.label}`}
                        content={item.label}
                        className={sidebarCollapsed ? "flex" : "hidden"}
                    />
                </>
            ))}
        </div>
    )
}

export default InstructorView