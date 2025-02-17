import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { InstructorContext } from "@/context/instructor"
import { deleteCourse, deleteImageMedia, deleteVideoMedia } from "@/services"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { adjustPrice } from "@/utils"


function InstructorCourses({ courses }) {
    const navigate = useNavigate()
    const { 
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        setInstructorCourses,
        setCurrentEditedCourse
    } = useContext(InstructorContext)
    const [loadingCourseId, setLoadingCourseId] = useState(null)
    
    async function handleDeleteCourse(id) {
        try {
            setLoadingCourseId(id)
            const course = courses.find(course => course._id === id)
            const courseImage = course.public_id
            const courseCurriculum = course.curriculum
            const curriculumVideos = courseCurriculum.map(video => video.public_id)
    
            const deleteImageResponse = await deleteImageMedia(courseImage)
            const deleteVideoResponse = await deleteVideoMedia(curriculumVideos)
    
            if (deleteImageResponse?.success && deleteVideoResponse?.success) {
                const deleteCourseResponse = await deleteCourse(id)
    
                if (deleteCourseResponse?.success) {
                    setInstructorCourses(prevCourses => prevCourses.filter(course => course._id !== id))
                    setLoadingCourseId(null)
                }
            }
        } catch (err) {
            setLoadingCourseId(null)
            console.log(err)
        }
    }

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
                        <Table className="table-fixed">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/2">Course</TableHead>
                                    <TableHead className="w-1/6">Students</TableHead>
                                    <TableHead className="w-1/6">Price</TableHead>
                                    <TableHead className="w-1/12">Revenue</TableHead>
                                    <TableHead className="w-1/6 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                { courses?.map(course => (
                                    <TableRow key={course?._id} className="text-base font-mono">
                                        { loadingCourseId === course?._id ? (
                                            <TableCell colSpan={5} className="w-full">
                                                <div className="flex justify-center items-center h-full my-0.5">
                                                    <LoadingSpinner className="w-5 h-5 mr-4" />
                                                    <span className="text-lg font-semibold">
                                                        Deleting course...
                                                    </span>
                                                </div>
                                            </TableCell>
                                        ) : (
                                            <>
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
                                                        onClick={() => handleDeleteCourse(course?._id)} 
                                                    >
                                                        <Trash className="h-6 w-6" />
                                                    </Button>
                                                </TableCell>
                                            </>
                                        )}
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