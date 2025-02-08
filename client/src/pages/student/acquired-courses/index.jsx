import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAcquiredCourses } from "@/services"
import { AuthContext } from "@/context/auth"
import { StudentContext } from "@/context/student"
import { Card, CardContent} from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"


function AcquiredCoursesPage() {
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext)
    const { acquiredCourses, setAcquiredCourses, loading, setLoading } = useContext(StudentContext)
    
    async function getStudentAcquiredCourses() {
        const response = await getAcquiredCourses(auth?.user?._id)
        setAcquiredCourses(response?.data)
        setLoading(false)
    }

    useEffect(() => {
        getStudentAcquiredCourses()
    }, [])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-16 p-4">
                My Courses
            </h1>
            <div className="flex items-center justify-center">
                { acquiredCourses && acquiredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
                        { acquiredCourses.map((item, index) => (
                            <Card key={index} onClick={() => navigate(`/course-progress/${item.courseId}`)} className="flex flex-col items-center hover:shadow-lg transition duration-500">
                                <CardContent className="flex-grow p-4">
                                    <img 
                                        src={item.courseImage} 
                                        alt={item.title} 
                                        className="w-full object-cover h-52 mb-4 rounded-lg cursor-pointer" 
                                    />
                                    <div className="pl-1">
                                        <h3 className="font-semibold text-base text-gray-900">
                                            { item.title }
                                        </h3>
                                        <p className="text-base text-gray-700">
                                            { item.instructorName }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : loading ? (
                    <LoadingSpinner className="mt-20 w-12 h-12" />
                ) : (
                    <div className="flex flex-col items-center mt-20 text-xl font-medium text-gray-700">
                        <h1>No Courses Found</h1>
                        <h1>¯\_(ツ)_/¯</h1>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AcquiredCoursesPage