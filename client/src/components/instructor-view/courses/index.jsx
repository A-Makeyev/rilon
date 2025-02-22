import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { InstructorContext } from "@/context/instructor"
import { deleteCourse, deleteMedia } from "@/services"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { adjustPrice } from "@/utils"
import { Input } from "@/components/ui/input"


function InstructorCourses({ courses }) {
    const navigate = useNavigate()
    const {
      setCourseLandingFormData,
      setCourseCurriculumFormData,
      setInstructorCourses,
      setCurrentEditedCourse,
    } = useContext(InstructorContext)
    const [loadingCourseId, setLoadingCourseId] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [confirmDeleteCourseValue, setConfirmDeleteCourseValue] = useState('')
    const [open, setOpen] = useState(false)

    async function handleDeleteCourse() {
      if (!selectedCourse) return

      try {
        setOpen(false)
        setLoadingCourseId(selectedCourse._id)

        const course = courses.find((course) => course._id === selectedCourse._id)
        const courseImage = course.public_id
        const courseCurriculum = course.curriculum
        const curriculumVideos = courseCurriculum.map((video) => video.public_id)
  
        const deleteImageResponse = await deleteMedia(courseImage, 'image')
        const deleteVideoResponse = await deleteMedia(curriculumVideos, 'video')
  
        if (deleteImageResponse?.success && deleteVideoResponse?.success) {
          const deleteCourseResponse = await deleteCourse(selectedCourse._id)
  
          if (deleteCourseResponse?.success) {
            setInstructorCourses((prevCourses) => prevCourses.filter((course) => course._id !== selectedCourse._id))
            setConfirmDeleteCourseValue('')
            setLoadingCourseId(null)
          }
        }
      } catch (err) {
        setConfirmDeleteCourseValue('')
        setLoadingCourseId(null)
        console.log(err)
      }
    }
    
    useEffect(() => {
        if (!open) {
            setConfirmDeleteCourseValue('')
        }
    }, [open])

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
                    navigate("/instructor/create-new-course")
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
                                { courses?.map((course) => (
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
                                                        onClick={() => navigate(`/instructor/edit-course/${course?._id}`)}
                                                    >
                                                        <Edit className="h-6 w-6" />
                                                    </Button>
                                                    <Dialog open={open} onOpenChange={setOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="transparent"
                                                                onClick={() => {
                                                                    setSelectedCourse(course)
                                                                    setOpen(true)
                                                                }}
                                                            >
                                                                <Trash className="h-6 w-6" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent 
                                                            aria-describedby={confirmDeleteCourseValue === selectedCourse?.title ? "delete-description" : undefined}
                                                            aria-hidden={open ? "false" : "true"}
                                                            className="sm:w-[425px]"
                                                        >
                                                            <DialogTitle>
                                                                { selectedCourse?.title }
                                                            </DialogTitle>
                                                            <div className="font-medium mt-2 mb-1 ml-0.5 cursor-default">
                                                                <p className="mb-2">
                                                                    Are you sure you want to delete this course?
                                                                </p>
                                                                <Input
                                                                    value={confirmDeleteCourseValue}
                                                                    onChange={(e) => setConfirmDeleteCourseValue(e.target.value)}
                                                                    placeholder="Type the course name to proceed"
                                                                    className="mb-2 ml-[-5px]"
                                                                />

                                                                { confirmDeleteCourseValue === selectedCourse?.title && (
                                                                    <DialogDescription id="delete-description" className="absolute text-red-700 duration-300">
                                                                        This cannot be undone
                                                                    </DialogDescription>
                                                                )}
                                                            </div>
                                                            <div className="flex justify-end space-x-2">
                                                                <Button 
                                                                    variant="outline" 
                                                                    onClick={() => setOpen(false)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button 
                                                                    variant="destructive" 
                                                                    onClick={handleDeleteCourse} 
                                                                    disabled={confirmDeleteCourseValue !== selectedCourse?.title}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
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