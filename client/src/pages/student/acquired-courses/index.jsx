import { useContext, useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "@/context/auth"
import { StudentContext } from "@/context/student"
import { getAcquiredCourses, getCourseProgress } from "@/services"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CheckCircle, Play } from "lucide-react"
import { Tooltip } from "react-tooltip"


function AcquiredCoursesPage() {
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext)
    const { 
        acquiredCourses, 
        setAcquiredCourses,    
        acquiredCoursesProgresses, 
        setAcquiredCoursesProgresses,     
        loading, 
        setLoading 
    } = useContext(StudentContext)
    const [nextLecture, setNextLecture] = useState(null)

    async function getStudentAcquiredCourses() {
        const response = await getAcquiredCourses(auth?.user?._id)

        if (response?.success) {
            setAcquiredCourses(response?.data)
            setLoading(false)
        }
    }

    async function getAcquiredCourseProgresses() {
        setLoading(true)
        const courseProgress = []
        for (let i = 0; i < acquiredCourses.length; i++) {
            const response = await getCourseProgress(auth?.user?._id, acquiredCourses[i].courseId)

            if (response?.success) {
                const lectures = response?.data?.courseDetails?.curriculum
                const completedLectures = response?.data?.progress?.length
                const nextLecture = response?.data?.courseDetails?.curriculum[completedLectures]?.title
    
                courseProgress.push({
                    lectures,
                    nextLecture,
                    completedLectures,
                    courseId: response?.data?.courseDetails?._id,
                    progressPercentage: Math.round((completedLectures / lectures?.length) * 100)
                })
            }
        }
        setAcquiredCoursesProgresses(courseProgress)
        setLoading(false)
    }

    useEffect(() => {
        getStudentAcquiredCourses()
    }, [])

    useEffect(() => {
        if (acquiredCourses !== null) {
            getAcquiredCourseProgresses()
        }
    }, [acquiredCourses])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6 p-4">
                My Courses
            </h1>
            { loading ? (
                <div className="flex flex-col items-center mt-20">
                    <LoadingSpinner className="mt-20 w-12 h-12" />
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    { acquiredCourses && acquiredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                            { acquiredCourses.map((item, index) => (
                                <Card key={index} className="flex flex-col items-center hover:shadow-lg duration-300">
                                    <CardContent className="relative flex-grow w-full p-4">
                                        <div 
                                            onClick={() => navigate(`/course-progress/${item.courseId}`)} 
                                            className="relative h-52 rounded-lg overflow-hidden cursor-pointer group"
                                        >
                                            <img 
                                                alt={item.title} 
                                                src={item.courseImage} 
                                                className="w-full h-full object-cover rounded-lg duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 duration-500 group-hover:opacity-100"></div>
                                            <Play className="w-10 h-10 absolute inset-0 m-auto opacity-0 duration-500 group-hover:opacity-100 group-hover:scale-125 text-white" />
                                        </div>
                                        <div className="mt-4 pl-1 font-medium cursor-default">
                                            <div className="mb-5">
                                                <h3 className="font-semibold text-base text-gray-900">
                                                    { item.title.length > 35
                                                        ? item.title.slice(0, 35) + '...'
                                                        : item.title
                                                    }
                                                </h3>
                                                <h4 className="text-sm text-gray-700">
                                                    { item.courseCategory.replace('-', ' ') }
                                                </h4>
                                                <p className="text-sm text-gray-700">
                                                    { item.instructorName }
                                                </p>
                                            </div>
                                            <div  
                                                data-tooltip-id="progress"
                                                className={acquiredCoursesProgresses[index]?.progressPercentage !== 100 ? 'cursor-pointer hover:opacity-80 duration-200' : null}
                                                onClick={() => navigate(`/course-progress/${item.courseId}`)}
                                                onMouseEnter={() => {
                                                    setNextLecture(
                                                        acquiredCoursesProgresses[index]?.progressPercentage !== 100 
                                                            ? acquiredCoursesProgresses[index]?.nextLecture
                                                            : null
                                                    )
                                                }}
                                            >
                                                <p className={`${acquiredCoursesProgresses[index]?.progressPercentage !== 100 ? 'mt-12' : null} text-sm mb-2`}>
                                                    { acquiredCoursesProgresses[index]?.progressPercentage === 100 && (
                                                        <span>
                                                            Rate this course
                                                        </span>
                                                    )}
                                                </p>
                                                <Progress value={acquiredCoursesProgresses[index]?.progressPercentage} />
                                            </div>
                                            <div className="flex flex-row justify-between t-2">
                                                <div className="flex flex-row gap-2 mt-3 text-sm">
                                                    <CheckCircle className="w-4 h-4 mt-0.5" />
                                                    { acquiredCoursesProgresses[index]?.completedLectures }
                                                    {' '} / {' '}
                                                    { acquiredCoursesProgresses[index]?.lectures?.length } 
                                                    {' '}
                                                    { acquiredCoursesProgresses[index]?.lectures?.length === 1 ? 'lecture' : 'lectures' }
                                                </div>
                                                <p className="mt-3 text-sm">
                                                    { acquiredCoursesProgresses[index]?.progressPercentage }
                                                    % Complete
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center mt-20 text-xl font-medium text-gray-700">
                            <h1>No Courses Found</h1>
                            <h1>¯\_(ツ)_/¯</h1>
                        </div>
                    )}
                </div> 
            )}
            <Tooltip
                id="progress"
                place="bottom"
                content={nextLecture ? `Next lecture: ${nextLecture}` : ''}
                className="max-w-80 font-medium whitespace-pre-wrap"
            />
        </div>
    )
}

export default AcquiredCoursesPage