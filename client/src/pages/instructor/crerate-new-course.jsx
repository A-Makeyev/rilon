import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/context/auth"
import { useNavigate, useParams } from "react-router-dom"
import { InstructorContext } from "@/context/instructor"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addNewCourse, getInstructorCourseDetails, updateCourse } from "@/services"
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog"
import CourseCurriculum from "@/components/instructor-view/courses/crerate-new-course/course-curriculum"
import CourseLandingPage from "@/components/instructor-view/courses/crerate-new-course/course-landing-page"
import CourseSettings from "@/components/instructor-view/courses/crerate-new-course/course-settings"

function CreateNewCourse() {
    const params = useParams()
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext)
    const {
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        currentEditedCourse,
        setCurrentEditedCourse,
    } = useContext(InstructorContext)
    const [updatedDataWasSaved, setUpdatedDataWasSaved] = useState(false)
    const [copyCourseLandingFormData, setCopyCourseLandingFormData] = useState(courseLandingFormData)
    const [copyCourseCurriculumFormData, setCopyCourseCurriculumFormData] = useState(courseCurriculumFormData)
    const [isLoading, setIsLoading] = useState(true)

    function unsavedChanges() {
        return (
            JSON.stringify(courseLandingFormData) !== JSON.stringify(copyCourseLandingFormData) ||
            JSON.stringify(courseCurriculumFormData) !== JSON.stringify(copyCourseCurriculumFormData)
        )
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0
        }
        return value === '' || value === null || value === undefined
    }

    function validateFormData() {
        for (let key in courseLandingFormData) {
            if (isEmpty(courseLandingFormData[key])) {
                return false
            }
        }

        let hasPreview = false

        for (let item of courseCurriculumFormData) {
            if (isEmpty(item.title) || isEmpty(item.video_url) || isEmpty(item.public_id)) {
                return false
            }

            if (item.preview) {
                hasPreview = true
            }
        }
        return hasPreview
    }

    function removeWhiteSpace(obj) {
        if (Array.isArray(obj)) {
            return obj.map(removeWhiteSpace)
        } else if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [
                    key,
                    typeof value === 'string' ? value.trim() : removeWhiteSpace(value)
                ])
            )
        }
        return obj
    }

    async function handleCreateNewCourse() {
        const courseData = removeWhiteSpace({
            date: new Date(),
            instructorId: auth?.user?._id,
            instructorName: auth?.user?.username,
            curriculum: courseCurriculumFormData,
            isPublished: true,
            ...courseLandingFormData
        })

        const response = currentEditedCourse !== null ? await updateCourse(currentEditedCourse, courseData) : await addNewCourse(courseData)
        if (response?.success) {
            setCourseCurriculumFormData(courseCurriculumInitialFormData)
            setCourseLandingFormData(courseLandingInitialFormData)
            setCurrentEditedCourse(null)
            navigate(-1)
        }
    }

    async function getCourseDetails() {
        setIsLoading(true)
        const response = await getInstructorCourseDetails(currentEditedCourse)
        if (response?.success) {
            const courseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key]
                return acc
            }, {})

            setCourseLandingFormData(courseFormData)
            setCourseCurriculumFormData(response?.data?.curriculum)
            setTimeout(() => window.scrollTo(0, 0), 0)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (!updatedDataWasSaved) {
            if (JSON.stringify(courseLandingFormData) !== JSON.stringify(copyCourseLandingFormData)
            && JSON.stringify(courseCurriculumFormData) !== JSON.stringify(copyCourseCurriculumFormData)) {
                setUpdatedDataWasSaved(true)
                setCopyCourseLandingFormData(courseLandingFormData)
                setCopyCourseCurriculumFormData(courseCurriculumFormData)
            }
        }
    }, [courseLandingFormData, courseCurriculumFormData])

    useEffect(() => {
        if (currentEditedCourse !== null) {
            getCourseDetails()
        } else {
            setIsLoading(false)
        }
    }, [currentEditedCourse])

    useEffect(() => {
        if (params?.courseId) {
            setCurrentEditedCourse(params?.courseId)
        }

        return () => {
            setCourseLandingFormData({})
            setCourseCurriculumFormData([])
            setCurrentEditedCourse(null)
            setUpdatedDataWasSaved(false)
        }
    }, [params?.courseId])

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (unsavedChanges()) {
                event.preventDefault()
                return
            }
        }
    
        window.addEventListener('beforeunload', handleBeforeUnload)
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [unsavedChanges])

    const skeletonStyle = {
        background: 'linear-gradient(90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%)',
        backgroundSize: '400% 100%',
        animation: 'shimmer 1s infinite ease-in-out',
        borderRadius: '6px',
        color: 'transparent',
        display: 'inline-block',
        width: '200px',
        height: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        filter: 'blur(0.5px)'
    }

    return (
        <div className="container mx-auto p-4 mt-4">
            <style>
                {`
                    @keyframes shimmer {
                        0% { background-position: 100% 0 }
                        100% { background-position: -100% 0 }
                    }
                `}
            </style>
            <div className="flex flex-col md:flex-row justify-between gap-2">
                { unsavedChanges() ? (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="font-semibold"
                            >
                                <ArrowLeft />
                                Back
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:w-[425px]">
                            <DialogTitle className="font-semibold text-xl">
                                Unsaved Changes
                            </DialogTitle>
                            <DialogDescription className="text-base font-medium text-gray-900 mt-3">
                                If you exit now all recent changes will be lost
                            </DialogDescription>
                            <div className="flex justify-end space-x-2 mt-5">
                                <DialogClose asChild>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button
                                        variant="destructive"
                                        onClick={() => navigate('/instructor')}
                                    >
                                        Discard
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button
                                        disabled={!validateFormData()}
                                        onClick={handleCreateNewCourse}
                                    >
                                        { currentEditedCourse ? 'Update' : 'Create' }
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                ) : (
                    <Button
                        variant="outline"
                        className="font-semibold"
                        onClick={() => navigate('/instructor')}
                    >
                        <ArrowLeft />
                        Back
                    </Button>
                )}
                <Button
                    className="md:order-2"
                    disabled={!validateFormData()}
                    onClick={handleCreateNewCourse}
                >
                    <Zap />
                    { currentEditedCourse ? 'Update' : 'Create' }
                </Button>
                <h1 className="mt-5 md:mt-0 mb-6 px-2 text-center text-2xl font-bold font-mono">
                    { isLoading  
                        ? <span style={skeletonStyle}>Loading...</span>  
                        : (courseLandingFormData?.title ? courseLandingFormData?.title : 'New Course') 
                    }
                </h1>
            </div>
            <Card className="pb-0 sm:pb-4 px-0 sm:px-2">
                <CardContent>
                    <div className="container p-4 -mb-2">
                        { isLoading ? (
                            <div>
                                <div className="flex justify-center mb-4">
                                    <div style={{ ...skeletonStyle, width: '300px', height: '40px' }}></div>
                                </div>
                                <div style={{ ...skeletonStyle, width: '100%', height: '200px' }}></div>
                            </div>
                        ) : (
                            <Tabs defaultValue="curriculum" className="space-y-4" onClick={() => window.scrollTo(0, 0)}>
                                <div className="flex justify-center">
                                    <TabsList className="grid grid-cols-3 xl:inline-flex">
                                        <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                                        <TabsTrigger value="landing-page">Landing Page</TabsTrigger>
                                        <TabsTrigger value="settings">Settings</TabsTrigger>
                                    </TabsList>
                                </div>
                                <TabsContent value="curriculum">
                                    <CourseCurriculum />
                                </TabsContent>
                                <TabsContent value="landing-page">
                                    <CourseLandingPage />
                                </TabsContent>
                                <TabsContent value="settings">
                                    <CourseSettings />
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateNewCourse