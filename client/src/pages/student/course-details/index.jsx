import { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "@/context/auth"
import { StudentContext } from "@/context/student"
import { createPayment, getCoursePurchaseInfo, getStudentCourseDetails } from "@/services"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Globe, Lock, PlayCircle, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { adjustPrice } from "@/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import VideoPlayer from "@/components/video-player"


function StudentCoursesDetailsPage() {
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
    const [displayPreview, setDisplayPreview] = useState({})
    const [currentPreview, setCurrentPreview] = useState(null)
    const [approvalUrl, setApprovalUrl] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)

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
            ? studentCourseDetails.curriculum[previewVideoUrl]
            : null
    }

    function handlePreview(lecture) {
        setDisplayPreview(lecture)
        setCurrentPreview(lecture.title)
        setRefreshKey(oldKey => oldKey + 1)
    }

    async function handleCreatePayment() {
        try {
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
                coursePrice: studentCourseDetails.price,
                courseCategory: studentCourseDetails.category
            }
    
            const response = await createPayment(paymentPayload)
    
            if (response?.success) {
                sessionStorage.setItem('orderId', JSON.stringify(response?.data?.orderId))
                setApprovalUrl(response?.data?.approvalUrl)
            }
        } catch(err) {
            setLoading(false)
            console.log(err)
        }
    }

    useEffect(() => {
        if (currentCourseId !== null) {
            getCourseDetails()
        }
    }, [currentCourseId, getCourseDetails])

    useEffect(() => {
        if (displayPreview !== null && typeof displayPreview === 'object' && Object.keys(displayPreview).length > 0) {
            setOpenPreview(true)
        }
    }, [displayPreview])

    useEffect(() => {
        if (id) {
            setCurrentCourseId(id)
        }
    }, [id, setCurrentCourseId])

    useEffect(() => {
        return () => {
            setStudentCourseDetails(null)
            setCurrentCourseId(null)
        }
    }, [])

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
                        { studentCourseDetails.date.split('T')[0]}
                    </span>
                    <span className="flex items-center capitalize">
                        <Globe className="w-4 h-4 mr-1" />
                        { studentCourseDetails.language }
                    </span>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:gap-4 mt-8">
                <main className="flex-grow w-full lg:w-[800px]">
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Objectives
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 p-3">
                                { studentCourseDetails.objectives.split(',').map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                                        <span className="text-sm font-medium capitalize text-gray-800">
                                            { item }
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium mb-4 p-3">
                                { studentCourseDetails.description }
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="my-4">
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
                                    className={`${item.preview ? 'cursor-pointer hover:text-gray-700 transition' : null} flex items-center mb-4 pl-2`}
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
                            <div className="flex items-center justify-center aspect-video mb-6">
                                <VideoPlayer url={getPreviewVideo().video_url} videoId={getPreviewVideo().public_id} />
                            </div>
                            <div className="flex flex-row justify-between pl-2">
                                <span className="text-lg font-semibold font-mono mt-1.5">
                                    { adjustPrice(studentCourseDetails.price) }
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
                    setDisplayPreview({})
                }}
            >
                <DialogContent className="border-none bg-gray-900">
                    <DialogHeader>
                        <DialogTitle className="ml-2 mt-0.5 text-gray-50">
                            Course Preview
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center mt-2">
                        <div className="w-full max-w-[650px] h-[350px]">
                            <VideoPlayer key={refreshKey} url={displayPreview.video_url} videoId={displayPreview.public_id} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 font-medium text-gray-50 mt-2">
                        { studentCourseDetails.curriculum.filter(lecture => lecture.preview).map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handlePreview(item)}
                                className={`${item.title === currentPreview ? 'underline pointer-events-none' : 'cursor-pointer hover:text-gray-300 transition'} pl-2`}
                            >
                                <div className="flex flex-row">
                                    <PlayCircle className="w-5 h-5 mr-2 mt-2" />
                                    <p className="mt-1.5">
                                        { item.title }
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogDescription className="py-4 pl-4 font-medium text-gray-300">
                        { studentCourseDetails.welcomeMessage }
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentCoursesDetailsPage