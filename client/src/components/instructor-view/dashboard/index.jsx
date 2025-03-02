import { adjustPrice } from "@/utils"
import { Users, Landmark } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


function InstructorDashboard({ courses }) {
    const config = [
        {
            icon: Users,
            label: 'Students',
            value: calculateRevenue().totalStudents
        },
        {
            icon: Landmark,
            label: 'Revenue',
            value: adjustPrice(calculateRevenue().revenue)
        },
    ]

    function calculateRevenue() {
        const { studentList, totalStudents, revenue } = courses.reduce((acc, course) => {
            const students = course.students.length
            acc.revenue += course.price * students
            acc.totalStudents += students
            
            course.students.forEach(student => {
                acc.studentList.push({
                    courseTitle: course.title,
                    studentName: student.studentName,
                    studentEmail: student.studentEmail
                })
            })
            return acc
        }, {
            studentList: [],
            totalStudents: 0,
            revenue: 0
        })
        return { 
            studentList, 
            totalStudents, 
            revenue 
        }
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                { config.map((item, index) => (
                    <Card key={index} className="hover:shadow-lg duration-300">
                        <CardHeader className="flex flex-row items-center justify-center space-y-2 pb-3">
                            <item.icon className="w-4 h-4 mr-1 mt-2" />
                            <CardTitle className="text-xl font-medium">
                                { item.label }
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-row items-center justify-center space-y-2">
                            <div className="text-xl font-medium">
                                { item.value }
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            { calculateRevenue().studentList.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Courses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table className="text-base font-medium font-mono">
                                    <TableHeader>
                                        <TableRow>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Email</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                <TableBody>
                                    { calculateRevenue().studentList.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                { item.courseTitle }
                                            </TableCell>
                                            <TableCell>
                                                { item.studentName }
                                            </TableCell>
                                            <TableCell>
                                                { item.studentEmail }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default InstructorDashboard