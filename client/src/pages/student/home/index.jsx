import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "@/context/auth"
import { StudentContext } from "@/context/student"
import { courseCategories } from "@/config"
import { getCoursePurchaseInfo, getStudentCourses } from "@/services"
import { Button } from "@/components/ui/button"
import { adjustPrice } from "@/utils"
import { Play, ScrollText, User2 } from "lucide-react"
import banner from "/src/assets/banner.jpg"


function StudentHomePage() {
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext)
    const { studentCourses, setStudentCourses } = useContext(StudentContext)

    async function getCourses() {
        const response = await getStudentCourses()

        if (response?.success) {
            setStudentCourses(response?.data)
        }
    }

    async function handleCourseNavigation(id) {
        const response = await getCoursePurchaseInfo(id, auth?.user?._id)

        if (response?.success) {
            if (response?.data) {
                navigate(`/course-progress/${id}`)
            } else {
                navigate(`/course/details/${id}`)
            }
        }
    }

    async function handleCategoriesNavigation(id) {
        sessionStorage.removeItem('filters')

        const newFilters = {
            category: [id]
        }

        sessionStorage.setItem('filters', JSON.stringify(newFilters))
        navigate('/courses')
    }

    useEffect(() => {
        getCourses()
    }, [])

    return (
        <div className="min-h-screen bg-white">
            <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
                <div className="lg:w-1/2 lg:pr-12 my-10 container">
                    <h1 className="text-xl lg:text-3xl font-bold mb-4">
                        Software courses for high school and college students
                    </h1>
                    <p className="text-lg lg:xl">
                        Be fully confident to pass your next exams and get the career you always desired with our experienced teachers
                    </p>
                </div>
                <div className="lg:w-full mb-8 lg:mb-0">
                    <img src={banner} className="w-full h-auto rounded-md shadow-md" />
                </div>
            </section>
            <section className="py-8 px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">
                    Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    { courseCategories.map(item => (
                        <Button key={item.id} onClick={() => handleCategoriesNavigation(item.id)} variant="outline" className="justify-start">
                            { item.label }
                        </Button>
                    ))}
                </div>
            </section>
            <section className="py-12 px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">
                    { studentCourses.length > 0 ? 'Featured Courses' : 'No Available Courses' }
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    { studentCourses && studentCourses.length > 0 && (
                        studentCourses.map(item => (
                            <div key={item.title} className="shadow border rounded overflow-hidden hover:shadow-lg duration-300">
                                <div 
                                    onClick={() => handleCourseNavigation(item._id)} 
                                    className="relative h-60 cursor-pointer group overflow-hidden"
                                >
                                    <img 
                                        src={item.image_url} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 duration-500 group-hover:opacity-100"></div>
                                    <Play className="w-10 h-10 absolute inset-0 m-auto opacity-0 duration-500 group-hover:opacity-100 group-hover:scale-125 text-white" />
                                </div>
                                <div className="p-4 space-y-1">
                                    <p className="text-lg font-semibold">
                                        <span 
                                            onClick={() => handleCourseNavigation(item._id)} 
                                            className="cursor-pointer text-gray-700 hover:text-gray-500 transition"
                                        >
                                            { item.title }
                                        </span>
                                    </p>
                                    <p className="flex flex-row text-base font-semibold text-gray-700">
                                        <User2 className="w-4 h-4 mt-1 mr-1" />
                                        Created by
                                        <span className="cursor-pointer ml-1 text-gray-700 hover:text-gray-500 transition">
                                            { item.instructorName }
                                        </span>
                                    </p>
                                    <p className="flex flex-row text-base font-semibold capitalize text-gray-700">
                                        <ScrollText className="w-4 h-4 mt-1 mr-1" />
                                        {`${item.curriculum.length} ${item.curriculum.length <= 1 ? 'Lecture' : 'Lectures'}, ${item.level}`}
                                    </p>
                                    <p className="text-lg font-semibold font-mono">
                                        { adjustPrice(item.price) }
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}

export default StudentHomePage