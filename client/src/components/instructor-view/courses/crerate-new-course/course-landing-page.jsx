import { useContext } from "react"
import { InstructorContext } from "@/context/instructor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { courseLandingPageFormControls } from "@/config"
import FormControls from "@/components/common-form/form-controls"


function CourseLandingPage() {
    const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext)

    return (
        <Card className="px-4 pb-4">
            <CardHeader className="px-4">
                <CardTitle className="text-lg font-medium mt-2">
                    Details
                </CardTitle>
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