import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash } from "lucide-react"
import { useNavigate } from "react-router-dom"


function InstructorCourses({ courses }) {
    const navigate = useNavigate()

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-2xl">
                    All Courses
                </CardTitle>
                <Button className="p-6" onClick={() => navigate('/instructor/create-new-course')}>
                    Create New Course
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table> 
                        <TableHeader>
                            <TableRow>
                            <TableHead>Course</TableHead> 
                            <TableHead>Students</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { courses && courses.length > 0 ? 
                                courses.map(course => (
                                    <TableRow key={course.title}>
                                        <TableCell className="font-medium">
                                            { course.title }
                                        </TableCell>
                                        <TableCell>
                                            { course.students.length > 0 ? course.students.length : 'None' }
                                        </TableCell>
                                        <TableCell>
                                            { course.price ? course.price : ''}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="transparent" size="sm">
                                                <Edit className="h-6 w-6" />
                                            </Button>
                                            <Button variant="transparent" size="sm">
                                                <Trash className="h-6 w-6" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : null
                            }
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default InstructorCourses