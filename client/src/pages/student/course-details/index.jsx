import { useCallback, useContext, useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "@/context/auth"
import { StudentContext } from "@/context/student"
import { createPayment, getCoursePurchaseInfo, getStudentCourseDetails } from "@/services"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Globe, Lock, PlayCircle, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import VideoPlayer from "@/components/video-player"


function StudentCoursesDetailsPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const { id } = useParams()
    const { auth } = useContext(AuthContext)
    const {             
        studentCourseDetails, 
        setStudentCourseDetails,
        currentCourseId, 
        setCurrentCourseId, 
        loading, 
        setLoading
    } = useContext(StudentContext)
    const [openPreview, setOpenPreview] = useState(false)
    const [displayPreview, setDisplayPreview] = useState(null)
    const [currentPreview, setCurrentPreview] = useState(null)
    const [approvalUrl, setApprovalUrl] = useState('')

    const getCourseDetails = useCallback(async () => {
        const isCourseAcquired = await getCoursePurchaseInfo(currentCourseId, auth?.user?._id)
        
        if (isCourseAcquired?.success && isCourseAcquired?.courseAcquired) {
            navigate(`/course-progress/${currentCourseId}`)
            setCurrentCourseId(null)
            setLoading(false)
            return
        }

        const response = await getStudentCourseDetails(currentCourseId)
    
        if (response?.success) {
            setStudentCourseDetails(response?.data)
            setLoading(false)
        } else {
            setStudentCourseDetails(null)
            setLoading(false)
        }
    }, [currentCourseId, setStudentCourseDetails, setLoading])
    
    function getPreviewVideo() {
        const previewVideoUrl = studentCourseDetails !== null 
            ? studentCourseDetails.curriculum.findIndex(item => item.preview)
            : -1
            
        return previewVideoUrl !== -1 
            ? studentCourseDetails.curriculum[previewVideoUrl].video_url 
            : null
    }

    function handlePreview(lecture) {
        setDisplayPreview(lecture.video_url)
        setCurrentPreview(lecture.title)
    }

    async function handleCreatePayment() {
        setLoading(true)

        const paymentPayload = {
            payerId: '',
            paymentId: '',
            userId: auth?.user?._id,
            userName: auth?.user?.username,
            userEmail: auth?.user?.email,
            orderStatus: 'pending',
            paymentMethod: 'paypal',
            paymentStatus: 'initiated',
            orderDate: new Date(),
            instructorId: studentCourseDetails.instructorId,
            instructorName: studentCourseDetails.instructorName,
            courseImage: studentCourseDetails.image_url,
            courseTitle: studentCourseDetails.title,
            courseId: studentCourseDetails._id,
            coursePrice: studentCourseDetails.price
        }

        const response = await createPayment(paymentPayload)

        if (response?.success) {
            sessionStorage.setItem('orderId', JSON.stringify(response?.data?.orderId))
            setApprovalUrl(response?.data?.approvalUrl)
            setLoading(false)
        }
    }
    
    useEffect(() => {
        if (currentCourseId !== null) {
            getCourseDetails()
        }
    }, [currentCourseId, getCourseDetails])

    useEffect(() => {
        if (displayPreview !== null) {
            setOpenPreview(true)
        }
    }, [displayPreview])

    useEffect(() => {
        if (id) {
            setCurrentCourseId(id)
        }
    }, [id, setCurrentCourseId])

    useEffect(() => {
        if (!location.pathname.includes('/course/details/')) (
            setStudentCourseDetails(null),
            setCurrentCourseId(null)
        ) 
    }, [location.pathname, setStudentCourseDetails, setCurrentCourseId])

    if (approvalUrl !== '') {
        window.location.href = approvalUrl
    }

    if (!studentCourseDetails) {
        return <Skeleton />
    }

    return (
        <div className="xl:container mx-auto p-4 mt-4">
            <div className="bg-gray-800 text-white p-8 rounded-md">
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
                </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:gap-8 mt-8">
                <main className="flex-grow">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Objectives
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid lg:grid-cols-1 xl:grid-cols-2 md:grid-cols-2 gap-2 mb-3">
                                { studentCourseDetails.objectives.split(',').map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 w-11/12">
                                        <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-green-500" />
                                        <span className="font-medium text-gray-800">
                                            { item }
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">
                                { studentCourseDetails.description }
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Curriculum
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            { studentCourseDetails.curriculum.map((item, index) => (
                                <li 
                                    key={index} 
                                    onClick={item.preview ? () => handlePreview(item) : null}
                                    className={`${item.preview ? 'cursor-pointer hover:text-gray-700 transition' : 'cursor-not-allowed'} flex items-center mb-4`}
                                >
                                    { item.preview ? <PlayCircle className="w-5 h-5 mr-2" /> : <Lock className="w-5 h-5 mr-2" /> }
                                    <span className="font-medium">
                                        { item.title }
                                    </span>
                                </li>
                            ))}
                        </CardContent>
                    </Card>
                </main>
                <aside className="w-full lg:w-[600px]">
                    <Card className="sticky top-20">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-center aspect-video rounded-md mb-6">
                                <VideoPlayer url={getPreviewVideo()} />
                            </div>
                            <div className="flex flex-row justify-between pl-2">
                                <span className="text-lg font-medium mt-1.5">
                                    $ { studentCourseDetails.price }
                                </span>
                                <Button onClick={handleCreatePayment} disabled={loading} className="flex items-center">
                                    { loading ? <LoadingSpinner className="w-4 h-4" /> : <ShoppingBag /> }
                                    Buy Course
                                </Button>
                            </div>
                            <span className="font-medium mt-1 mb-2 pl-2.5">
                                { studentCourseDetails.students.length 
                                    ? `${studentCourseDetails.students.length} ${studentCourseDetails.students.length === 1 ? 'Student' : 'Students'} enrolled` 
                                    : null
                                }
                            </span>
                        </CardContent>
                    </Card>
                </aside>
            </div>
            <Dialog 
                open={openPreview} 
                onOpenChange={() => {
                    setOpenPreview(false)
                    setDisplayPreview(null)
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="ml-2 mt-0.5">
                            Course Preview
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center aspect-video mt-2 rounded-md">
                        <VideoPlayer url={displayPreview} />
                    </div>
                    <div className="flex flex-col gap-2">
                        { studentCourseDetails.curriculum.filter(lecture => lecture.preview).map((item, index)=> (
                           <div 
                                key={index}
                                onClick={() => handlePreview(item)} 
                                className="font-medium pl-2 cursor-pointer hover:text-gray-700 transition"
                           >
                                <div className="flex flex-row">
                                    <PlayCircle className="w-5 h-5 mr-2 mt-2" />
                                    <p className={`${item.title === currentPreview ? 'underline' : null} mt-1.5`}>
                                        { item.title }
                                    </p>
                                </div>
                           </div> 
                        ))}
                    </div>
                    <DialogDescription className="pt-2 pl-4">
                        { studentCourseDetails.welcomeMessage }
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentCoursesDetailsPage