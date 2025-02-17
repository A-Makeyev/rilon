import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { deleteCourse, deleteMedia } from "@/services"
import { InstructorContext } from "@/context/instructor"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { adjustPrice } from "@/utils"


function InstructorCourses({ courses }) {
    const navigate = useNavigate()
    const { 
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        setInstructorCourses,
        setCurrentEditedCourse,
        loading, 
        setLoading
    } = useContext(InstructorContext)

    async function a() {
        await deleteMedia('i0zo1v3klykkoprz0ljh')
    }
    async function handleDeleteCourse(id) {
        try {
            const course = courses.find(course => course._id === id)
            const courseImage = course.public_id
            const courseCurriculum = course.curriculum
            const deletedVideos = []
    
            const deleteImageResponse = await deleteMedia(courseImage)
    
            if (deleteImageResponse?.success) {
                console.log('Deleted Image -> ' + courseImage)
            }
    
            for (let i = 0; i < courseCurriculum.length; i++) {
                const curriculumVideo = courseCurriculum[i].public_id
                const deleteVideoResponse = await deleteMedia(curriculumVideo)
    
                if (deleteVideoResponse?.success) {
                    deletedVideos.push(curriculumVideo)
                    console.log('Deleted Video -> ' + curriculumVideo)
                }  
            }      
    
            if (deleteImageResponse?.success && (deletedVideos.length === courseCurriculum.length)) {
                console.log('Deleted all assets from course -> ' + id)
                const deleteCourseResponse = await deleteCourse(id)
    
                if (deleteCourseResponse?.success) {
                    setInstructorCourses(prevCourses => prevCourses.filter(course => course._id !== id))
                    setLoading(false)
                }
            }
        } catch(err) {
            setLoading(false)
            console.log(err)
        }
    }

    console.log(courses)

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
                                { courses?.map(course => (
                                    <TableRow key={course?._id} className="text-base font-mono">
                                        <TableCell>
                                            { course?.title }
                                        </TableCell>
                                        <TableCell>
                                            { course?.students.length > 0 ? course?.students.length : 'None' }
                                        </TableCell>
                                        <TableCell>
                                            { adjustPrice(course?.price) }
                                        </TableCell>
                                        <TableCell>
                                            { adjustPrice(course?.price * course?.students.length) }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                size="sm"
                                                variant="transparent" 
                                                onClick={() => {navigate(`/instructor/edit-course/${course?._id}`)}}
                                            >
                                                <Edit className="h-6 w-6" />
                                            </Button>
                                            <Button 
                                                size="sm"
                                                variant="transparent"
                                                onClick={a} 
                                                //onClick={() => handleDeleteCourse(course?._id)} 
                                            >
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