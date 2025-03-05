import { useContext } from "react"
import { InstructorContext } from "@/context/instructor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { courseLandingPageFormControls } from "@/config"
import FormControls from "@/components/common-form/form-controls"


function CourseLandingPage() {
    const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext)

    return (
        <Card className="pb-0 sm:pb-4 -mx-4 lg:-mx-0">
            <CardHeader>
                <CardTitle className="text-xl font-medium mt-2 ml-2">
                    Course Details
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-8 pb-6">
                <FormControls                     
                    formData={courseLandingFormData}
                    setFormData={setCourseLandingFormData} 
                    formControls={courseLandingPageFormControls}
                />
            </CardContent>
        </Card>
    )   
}

export default CourseLandingPage