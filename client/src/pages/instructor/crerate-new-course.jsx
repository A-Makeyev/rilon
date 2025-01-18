import { useContext } from "react"
import { InstructorContext } from "@/context/instructor"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseCurriculum from "@/components/instructor-view/courses/crerate-new-course/course-curriculum"
import CourseLandingPage from "@/components/instructor-view/courses/crerate-new-course/course-landing-page"
import CourseSettings from "@/components/instructor-view/courses/crerate-new-course/course-settings"


function CreateNewCourse() {
    const { courseLandingFormData, courseCurriculumFormData } = useContext(InstructorContext)

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

    return (
        <div className="container mx-auto p-4 mt-4">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-5">
                    New Course
                </h1>
                <Button disabled={!validateFormData()} className="text-md tracking-wider font-bold px-8">
                    Create
                </Button>
            </div>
            <Card>
                <CardContent>
                    <div className="container mx-auto p-4">
                        <Tabs defaultValue="curriculum" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                                <TabsTrigger value="landing-page">Landing Page</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
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