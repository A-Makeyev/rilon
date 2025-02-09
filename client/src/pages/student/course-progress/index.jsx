import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCourseProgress } from "@/services"
import { StudentContext } from "@/context/student"
import { AuthContext } from "@/context/auth"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, PartyPopper, RotateCcw, TvMinimalPlay } from "lucide-react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import Confetti from "react-confetti"


function CourseProgressPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { auth } = useContext(AuthContext)
    const {             
        studentCourseDetails, 
        setStudentCourseDetails,
        currentCourseId, 
        setCurrentCourseId, 
        studentCourseProgress, 
        setStudentCourseProgress,
        loading, 
        setLoading
    } = useContext(StudentContext)
    const [lockCourse, setLockCourse] = useState(false)
    const [currentLecture, setCurrentLecture] = useState(null)
    const [displayCompletedCourse, setDisplayCompletedCourse] = useState(false)
    const [displayConfetti, setDisplayConfetti] = useState(false)

    async function getCurrentCourseProgress() {
        const response = await getCourseProgress(auth?.user?._id, id)
        
        if (response?.success) {
            if (!response?.data?.courseAcquired) {
                setLockCourse(true)
            } else {
                setStudentCourseProgress({
                    courseDetails: response?.data?.courseDetails,
                    progress: response?.data?.progress
                })

                if (response?.data?.completed) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0])
                    setDisplayCompletedCourse(true)
                    setDisplayConfetti(true)
                    return
                }
            }
        }
    }

    useEffect(() => {
        getCurrentCourseProgress()
    }, [id])

    useEffect(() => {
        if (displayConfetti) {
            setTimeout(() => setDisplayConfetti(false), 5000)
        }
    }, [displayConfetti])

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-50">
            { displayConfetti && 
                <Confetti numberOfPieces={500} gravity={0.02} wind={0.002} tweenDuration={5000} recycle={false} onConfettiComplete={(confetti) => setTimeout(() => confetti.reset(), 5000)} />
            }

            <div className="flex flex-center justify-between p-4 bg-gray-900 border-b border-gray-500">
                <div className="flex flex-center space-x-4">
                    <Button onClick={() => navigate('/acquired-courses')} variant="outline" className="text-gray-900 font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        My Courses
                    </Button>
                </div>
            </div>
            <Dialog open={lockCourse}>
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex flex-row gap-3">
                            <Lock />
                            <h1 className="mt-1">
                                Course Locked
                            </h1>
                        </DialogTitle>
                    </DialogHeader>
                    
                    <p className="font-medium mt-2 ml-1">
                        Please purchase this course to access the content
                    </p>
                </DialogContent>
            </Dialog>
            <Dialog open={displayCompletedCourse}>
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex flex-row gap-3">
                            <PartyPopper />
                            <h1 className="mt-1">
                                Congratulations!
                            </h1>
                        </DialogTitle>
                    </DialogHeader>
                    <p className="font-medium mt-2 ml-1">
                        You have successfully completed this course 
                    </p>
                    <div className="flex flex-row mt-2 gap-3">
                        <Button onClick={() => navigate('/acquired-courses')} variant="outline">
                            <TvMinimalPlay />
                            My Courses
                        </Button>
                        <Button variant="outline">
                            <RotateCcw />
                            Start Over
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div> 
    )
}

export default CourseProgressPage