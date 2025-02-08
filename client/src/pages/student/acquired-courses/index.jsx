import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAcquiredCourses } from "@/services"
import { AuthContext } from "@/context/auth"
import { StudentContext } from "@/context/student"
import { Card, CardContent} from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Play } from "lucide-react"


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
            <h1 className="text-2xl font-semibold mb-6 p-4">
                My Courses
            </h1>
            <div className="flex items-center justify-center">
                { acquiredCourses && acquiredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                        { acquiredCourses.map((item, index) => (
                            <Card key={index} className="flex flex-col items-center hover:shadow-lg duration-500">
                                <CardContent className="relative flex-grow w-full p-4">
                                    <div 
                                        onClick={() => navigate(`/course-progress/${item.courseId}`)} 
                                        className="relative sm:h-52 rounded-lg overflow-hidden cursor-pointer group"
                                    >
                                        <img 
                                            alt={item.title} 
                                            src={item.courseImage} 
                                            className="w-full h-full object-cover rounded-lg duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 duration-500 group-hover:opacity-100"></div>
                                        <Play className="w-10 h-10 absolute inset-0 m-auto opacity-0 duration-500 group-hover:opacity-100 group-hover:scale-125 text-white" />
                                    </div>
                                    <div className="mt-4 pl-1">
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