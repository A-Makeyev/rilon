import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { StudentContext } from "@/context/student"
import { getStudentCourseDetails } from "@/services"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


function StudentCoursesDetailsPage() {
    const params = useParams()
    const { id } = useParams()
    const {             
        studentCourseDetails, 
        setStudentCourseDetails,
        currentCourseId, 
        setCurrentCourseId, 
        loading, 
        setLoading
    } = useContext(StudentContext)

    async function getCourseDetails() {
        const response = await getStudentCourseDetails(currentCourseId)
        
        if (response?.success) {
            setStudentCourseDetails(response?.data)
        } else {
            setStudentCourseDetails(null)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (currentCourseId !== null) {
            getCourseDetails()
        }
    }, [currentCourseId])

    useEffect(() => {
        if (id) {
            setCurrentCourseId(id)
        }
    }, [id])

    if (loading) return <Skeleton />
    return (
        <div className="container mx-auto p-4">
            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <h1 className="text-3xl font-bold mb-4">
                    { studentCourseDetails.title }
                </h1>
                <p className="text-xl mb-4">
                    { studentCourseDetails.subtitle }
                </p>
                <div className="flex items-center space-x-4 mt-2 text-base">
                    <span>
                        Created By { studentCourseDetails.instructorName }
                    </span>
                    <span>
                        { studentCourseDetails.date.split('T')[0] }
                    </span>
                    <span className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        { studentCourseDetails.language }
                    </span>
                    <span>
                        { studentCourseDetails.students.length ? `${studentCourseDetails.students.length === 1 ? 'Student' : 'Students'}` : null }
                    </span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Curriculum
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                { studentCourseDetails.objectives.split(',').map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="w-4 h-4 mt-1 mr-2 flex-shrink-0 text-green-500" />
                                        <span className="font-medium text-gray-800">
                                            { item }
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}

export default StudentCoursesDetailsPage