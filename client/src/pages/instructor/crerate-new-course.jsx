import { useContext, useEffect } from "react"
import { AuthContext } from "@/context/auth"
import { useNavigate, useParams } from "react-router-dom"
import { InstructorContext } from "@/context/instructor"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addNewCourse, getInstructorCourseDetails, updateCourse } from "@/services"
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config"
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
        setCurrentEditedCourse
    } = useContext(InstructorContext)

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
            students: [],
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
        const response = await getInstructorCourseDetails(currentEditedCourse)
        if (response?.success) {
            const courseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key]
                return acc
            }, {})

            setCourseLandingFormData(courseFormData)
            setCourseCurriculumFormData(response?.data?.curriculum)
        }
    }

    useEffect(() => {
        if (currentEditedCourse !== null) {
            getCourseDetails()
        }
    }, [currentEditedCourse])

    useEffect(() => {
        if (params?.courseId) {
            setCurrentEditedCourse(params?.courseId)
        }
    }, [params?.courseId])

    return (
        <div className="container mx-auto p-4 mt-4">
            <div className="flex flex-col md:flex-row justify-between gap-2">
                <Button
                    variant="outline"
                    className="font-semibold"
                    onClick={() => navigate('/instructor')}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <Button
                    className="md:order-2 font-semibold"
                    disabled={!validateFormData()}
                    onClick={handleCreateNewCourse}
                >
                    <Zap className="w-4 h-4" />
                    {currentEditedCourse ? 'Update' : 'Create'}

                </Button>
                <h1 className="mt-5 md:mt-0 mb-6 px-2 text-center text-2xl font-bold font-mono">
                    {courseLandingFormData?.title ? courseLandingFormData?.title : 'New Course'}
                </h1>
            </div>
            <Card>
                <CardContent>
                    <div className="container mx-auto p-4">
                        <Tabs defaultValue="curriculum" className="space-y-4">
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
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateNewCourse