import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCourseProgress } from "@/services"
import { StudentContext } from "@/context/student"
import { AuthContext } from "@/context/auth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
    ArrowLeft, 
    ChevronLeft, 
    ChevronRight, 
    Lock, 
    PartyPopper, 
    PlayCircle, 
    RotateCcw, 
    TvMinimalPlay 
} from "lucide-react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import ConfettiExplosion from "react-confetti-explosion"
import VideoPlayer from "@/components/video-player"



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
    const [displaySideBar, setDisplaySideBar] = useState(true)

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

                if (response?.data?.progress?.length === 0) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0])
                }
            }
        }
    }
    
    useEffect(() => {
        getCurrentCourseProgress()
    }, [id])

    useEffect(() => {
        if (displayConfetti) {
            setTimeout(() => setDisplayConfetti(false), 6000)
        }
    }, [displayConfetti])

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-50">
            <div className="flex flex-col h-screen overflow-hidden">
                <div className="flex justify-between p-4 bg-gray-900 border-b border-gray-500">
                    <div className="flex items-center space-x-4">
                        <Button onClick={() => navigate('/acquired-courses')} variant="outline" className="ml-4 font-semibold text-gray-900">
                            <ArrowLeft className="w-4 h-4" />
                            My Courses
                        </Button>
                        <h1 className="text-lg font-semibold hidden md:block">
                            { studentCourseProgress?.courseDetails?.title }
                        </h1>
                    </div>
                    <div onClick={() => setDisplaySideBar(!displaySideBar)} className="mt-2.5 mr-4 cursor-pointer">
                        { displaySideBar ? <ChevronRight /> : <ChevronLeft /> }
                    </div>
                </div>
                <div className="relative flex flex-1">
                    <div className={`flex-1 transition-all duration-300 ${displaySideBar ? 'mr-[400px]' : ''}`}>
                        <div className="border-b border-gray-500">
                            <VideoPlayer width="100%" height="800px" url={currentLecture?.video_url} />
                        </div>
                        <div className="p-6 bg-gray-900">
                            <h2 className="mb-2 text-lg font-semibold">
                                { currentLecture?.title }
                            </h2>
                        </div>
                    </div>
                    <div className={`${displaySideBar ? 'translate-x-0' : 'translate-x-full'} absolute right-0 h-screen w-[400px] bg-gray-900 border-l border-gray-500 transition-all duration-300`}>
                        <Tabs defaultValue="content" className="flex flex-col h-full">
                            <TabsList className="grid grid-cols-2 gap-0.5 w-full bg-gray-900 p-0 h-14">
                                <TabsTrigger value="content" className="h-full text-gray-900 hover:bg-gray-200 text-base font-semibold rounded-none">
                                    Content
                                </TabsTrigger>
                                <TabsTrigger value="overview" className="h-full text-gray-900 hover:bg-gray-200 text-base font-semibold rounded-none">
                                    Overview
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="content">
                                <ScrollArea className="h-full">
                                    <div className="p-4 space-y-4">
                                        { studentCourseProgress?.courseDetails?.curriculum.map((item, index) => (
                                            <div key={index} className="flex items-center text-gray-50 space-x-2 curssor-pointer">
                                                <div className="flex flex-row items-center gap-3">
                                                    <PlayCircle className="w-5 h-5" />
                                                    <h3 className="font-semibold">
                                                        { item.title }
                                                    </h3>
                                                </div>
                                                {/* <div className="flex flex-row items-center gap-2">
                                                    <Button onClick={() => setCurrentLecture(item)} variant="outline">
                                                        <TvMinimalPlay />
                                                        Watch
                                                    </Button>
                                                </div> */}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                            <TabsContent value="overview" className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full p-4">
                                    <h2 className="mb-4 text-xl font-semibold">
                                        About this course
                                    </h2>
                                    <p>
                                        { studentCourseProgress?.courseDetails?.description }
                                    </p>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </div>
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
            { displayConfetti && 
                <ConfettiExplosion 
                    force={1} 
                    width={3000} 
                    duration={6000} 
                    particleCount={300} 
                    style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}
                />
            }
        </div> 
    )
}

export default CourseProgressPage