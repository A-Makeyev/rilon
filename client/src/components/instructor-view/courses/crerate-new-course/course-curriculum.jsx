import { useContext } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InstructorContext } from "@/context/instructor"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"


function CourseCurriculum() {
    const { courseCurriculumFormData, setCourseCurriculumFormData } = useContext(InstructorContext)

    function handleNewLacture() {
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            { ...courseCurriculumFormData[0] },
        ])
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={handleNewLacture}>Add Lecture</Button>
                <div className="mt-4 space-y-4">
                    { courseCurriculumFormData.map((item, index) => (
                        <div key={`lecture-${index}`} className="border p-5 rounded-md">
                            <div className="flex gap-5 items-center ml-1">
                                <h3 className="font-semibold">Lecture { index + 1}</h3>
                                <Input 
                                    name={`lecture-${index + 1}`}
                                    placeholder="What is this lectrue about?"
                                    className="max-w-96"
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch id={`preview-lecture-${index + 1}`} checked={true} />
                                    <Label htmlFor={`preview-lecture-${index + 1}`}>Preview</Label>
                                </div>
                            </div>
                            <div className="mt-5">
                                <Input 
                                    type="file"
                                    accept="video/*"
                                    className="mb-4 cursor-pointer"
                                />
                            </div>
                        </div>
                    ))}
                </div>  
            </CardContent>
        </Card>
    )   
}

export default CourseCurriculum
