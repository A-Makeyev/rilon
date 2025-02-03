import { useContext } from "react"
import { InstructorContext } from "@/context/instructor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { courseLandingPageFormControls } from "@/config"
import FormControls from "@/components/common-form/form-controls"


function CourseLandingPage() {
    const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="mt-3">Course Details</CardTitle>
            </CardHeader>
            <CardContent>
                <FormControls 
                    formControls={courseLandingPageFormControls}
                    formData={courseLandingFormData}
                    setFormData={setCourseLandingFormData} 
                />
            </CardContent>
        </Card>
    )   
}

export default CourseLandingPage
