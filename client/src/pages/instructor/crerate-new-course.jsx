import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseCurriculum from "@/components/instructor-view/courses/crerate-new-course/course-curriculum"
import CourseLandingPage from "@/components/instructor-view/courses/crerate-new-course/course-landing-page"
import CourseSettings from "@/components/instructor-view/courses/crerate-new-course/course-settings"


function CreateNewCourse() {
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-5">
                    New Course
                </h1>
                <Button className="text-md tracking-wider font-bold px-8">
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