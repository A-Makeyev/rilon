import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCourseProgress, lastViewedLecture, resetCourseProgress, viewLecture } from "@/services"
import { StudentContext } from "@/context/student"
import { AuthContext } from "@/context/auth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Lock,
    House,
    ChevronLeft,
    ChevronRight,
    PartyPopper,
    PlayCircle,
    RotateCcw,
    CheckCircle,
    TvMinimalPlay
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import VideoPlayer from "@/components/video-player"


function CourseProgressPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { auth } = useContext(AuthContext)
    const {studentCourseProgress, setStudentCourseProgress } = useContext(StudentContext)
    const [lockCourse, setLockCourse] = useState(false)
    const [currentLecture, setCurrentLecture] = useState(null)
    const [displayCompletedCourse, setDisplayCompletedCourse] = useState(false)
    const [displaySideBar, setDisplaySideBar] = useState(true)
    const [refreshKey, setRefreshKey] = useState(0)

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
                }

                if (response?.data?.lastViewedLecture) {
                    const lastViewdLectureId = response?.data?.lastViewedLecture
                    const lecture = response?.data?.courseDetails?.curriculum?.find(course => course._id === lastViewdLectureId)
                    setCurrentLecture(lecture)
                } else if (response?.data?.progress?.length === 0) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0])
                    return
                } else {
                    const lastLectureViewed = response?.data?.progress?.reduceRight((acc, obj, index) => {
                        return acc === -1 && obj.viewed ? index : acc
                    }, -1)
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[lastLectureViewed + 1])
                }
            }
        }
    }

    async function updateCourseProgress() {
        if (currentLecture) {
            const response = await viewLecture(
                auth?.user?._id, 
                studentCourseProgress?.courseDetails?._id, 
                currentLecture?._id
            )

            if (response?.success) {
                getCurrentCourseProgress()
            }
        }
    }

    async function handleResetCourseProgress() {
        const response = await resetCourseProgress(auth?.user?._id, studentCourseProgress.courseDetails._id)

        if (response?.success) {
            setCurrentLecture(null)
            setDisplayCompletedCourse(false)
            getCurrentCourseProgress()
        }
    }

    async function updateLastViewedLecture(lecture) {
        try {
            await lastViewedLecture(
                auth?.user?._id, 
                studentCourseProgress?.courseDetails?._id, 
                lecture._id
            )
        } catch(err) {
            console.log(err)
        }
    }

    function handleChangeLecture(item) {
        setCurrentLecture(item)
        updateLastViewedLecture(item)
        setRefreshKey(oldKey => oldKey + 1)
    }
    
    useEffect(() => {
        if (currentLecture?.progressValue === 1) {
            updateCourseProgress()
        }
    }, [currentLecture])

    useEffect(() => {
        getCurrentCourseProgress()
    }, [id])

    useEffect(() => {
        return () => {
            setStudentCourseProgress({})
        }
    }, [])

    return (
        <div className="flex flex-col bg-gray-900 text-gray-50">
            <div className="flex flex-col h-screen overflow-hidden">
                <div className="flex justify-between p-4 bg-gray-900 border-b border-gray-500">
                    <div className="flex items-center space-x-2">
                        <Button onClick={() => navigate('/home')} variant="outline" className="font-semibold text-gray-900">
                            <House className="w-4 h-4" />
                            Home
                        </Button>
                        <Button onClick={() => navigate('/acquired-courses')} variant="outline" className="font-semibold text-gray-900">
                            <TvMinimalPlay className="w-4 h-4" />
                            My Courses
                        </Button>
                        <h1 className="text-lg font-semibold hidden lg:block pl-3">
                            { studentCourseProgress?.courseDetails?.title }
                        </h1>
                    </div>
                    <div onClick={() => setDisplaySideBar(!displaySideBar)} className="mt-2.5 cursor-pointer">
                        { displaySideBar ? <ChevronRight /> : <ChevronLeft /> }
                    </div>
                </div>
                <div className="relative flex flex-1 overflow-y-auto overflow-x-hidden">
                    <div className={`flex-1 transition-all duration-300 ${displaySideBar ? 'mr-[400px]' : ''}`}>
                        <div className="border-b border-gray-500">
                            <VideoPlayer
                                key={refreshKey}
                                url={currentLecture?.video_url}
                                videoId={currentLecture?.public_id}
                                onProgressUpdate={setCurrentLecture}
                                progressData={currentLecture}
                                width="100%"
                                height="700px"
                            />
                        </div>
                        <div className="p-6 bg-gray-900">
                            <h2 className="mb-2 text-lg font-semibold">
                                { currentLecture?.title }
                            </h2>
                        </div>
                    </div>
                    <div className={`${displaySideBar ? 'translate-x-0' : 'translate-x-full'} absolute right-0 h-screen w-full lg:w-[400px] z-50 bg-gray-900 border-l border-gray-500 transition-all duration-300`}>
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
                                            <div 
                                                key={index} 
                                                onClick={() => handleChangeLecture(item)} 
                                                className={
                                                    `${currentLecture?._id === item._id ? 'underline font-bold text-gray-50' : null}
                                                    flex items-center w-full text-gray-300 hover:text-gray-100 transition space-x-2 cursor-pointer`
                                                }
                                            >
                                                <div className="flex flex-row items-center gap-3">
                                                    { studentCourseProgress.progress.find(lecture => lecture.lectureId === item._id)?.viewed ? (
                                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                                    ) : (
                                                        <PlayCircle className="w-5 h-5" />
                                                    )}
                                                    <h3 className="font-medium">
                                                        { item.title }
                                                    </h3>
                                                </div>
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
                            <p className="mt-1">
                                Course Locked
                            </p>
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
                            <p className="mt-1">
                                Congratulations!
                            </p>
                        </DialogTitle>
                    </DialogHeader>
                    <p className="font-medium mt-2 mb-1 ml-0.5">
                        You have completed this course
                    </p>
                    <div className="flex flex-row mt-2 gap-3">
                        <Button onClick={() => navigate('/acquired-courses')} variant="outline">
                            <TvMinimalPlay />
                            My Courses
                        </Button>
                        <Button onClick={handleResetCourseProgress} variant="outline">
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