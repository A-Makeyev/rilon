import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { InstructorContext } from "@/context/instructor"
import { Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config"


function InstructorCourses({ courses }) {
    const navigate = useNavigate()
    const { 
        setCourseLandingFormData, 
        setCourseCurriculumFormData, 
        setCurrentEditedCourse 
    } = useContext(InstructorContext)

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-2xl font-semibold mt-1">
                    All Courses
                </CardTitle>
                <Button 
                    className="p-6" 
                    onClick={() => {
                        setCurrentEditedCourse(null)
                        setCourseCurriculumFormData(courseCurriculumInitialFormData)
                        setCourseLandingFormData(courseLandingInitialFormData)
                        navigate('/instructor/create-new-course')
                    }}
                >
                    Create New Course
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    { courses && courses.length > 0 && (
                        <Table> 
                            <TableHeader>
                                <TableRow>
                                <TableHead>Course</TableHead> 
                                <TableHead>Students</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                { courses.map(course => (
                                    <TableRow key={course._id} className="text-base font-mono">
                                        <TableCell>
                                            { course.title }
                                        </TableCell>
                                        <TableCell>
                                            { course.students.length > 0 ? course.students.length : 'None' }
                                        </TableCell>
                                        <TableCell>
                                            ₪ { course.price ? course.price : '0' }
                                        </TableCell>
                                        <TableCell>
                                            ₪ { course.price * course.students }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                size="sm"
                                                variant="transparent" 
                                                onClick={() => {navigate(`/instructor/edit-course/${course._id}`)}}
                                            >
                                                <Edit className="h-6 w-6" />
                                            </Button>
                                            <Button variant="transparent" size="sm">
                                                <Trash className="h-6 w-6" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default InstructorCourses