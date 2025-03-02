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
import { toast } from "sonner"


function InstructorCourses({ courses }) {
    const navigate = useNavigate()
    const {
      setCourseLandingFormData,
      setCourseCurriculumFormData,
      setInstructorCourses,
      setCurrentEditedCourse,
    } = useContext(InstructorContext)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [loadingCourseId, setLoadingCourseId] = useState(null)
    const [confirmDeleteCourseValue, setConfirmDeleteCourseValue] = useState('')
    const [open, setOpen] = useState(false)

    async function handleDeleteCourse() {
      if (!selectedCourse || loadingCourseId) return
    
      try {
        setOpen(false)
        setLoadingCourseId(selectedCourse._id)

        const course = courses.find((course) => course._id === selectedCourse._id)
        const courseImage = course.public_id
        const courseCurriculum = course.curriculum
        const curriculumVideos = courseCurriculum.map((video) => video.public_id)
    
        let undo = false
        let timeout = 5000
        let secondsLeft = 5

        const toastId = toast(
            <div className="flex items-center gap-2">
                <LoadingSpinner className="w-4 h-4" />
                <span>
                    Course will be permanently deleted in {secondsLeft}
                </span>
            </div>,
            {
                duration: timeout,
                position: 'top-right',
                action: {
                    label: 'Undo',
                    onClick: () => {
                        undo = true
                        toast.dismiss(toastId)
                        setLoadingCourseId(null)
                        return
                    }
                }
            }
        )
    
        const countdownInterval = setInterval(() => {
            if (undo || secondsLeft <= 1) {
                clearInterval(countdownInterval)
                return
            }
        
            secondsLeft -= 1
            toast(
                <div className="flex items-center gap-2">
                    <LoadingSpinner className="w-4 h-4" />
                    <span>
                        Course will be permanently deleted in {secondsLeft}
                    </span>
                </div>,
                {
                    id: toastId,
                    position: 'top-right',
                    duration: timeout
                }
            )
        }, 1000)
    
        await new Promise((resolve) => setTimeout(resolve, timeout))
    
        if (undo) {
            toast.dismiss(toastId)
            return
        }

        const deleteImageResponse = await deleteMedia(courseImage, 'image')
        const deleteVideoResponse = await deleteMedia(curriculumVideos, 'video')
    
        if (deleteImageResponse?.success && deleteVideoResponse?.success) {
          const deleteCourseResponse = await deleteCourse(selectedCourse._id)
    
          if (deleteCourseResponse?.success) {
            setInstructorCourses((prevCourses) =>
              prevCourses.filter((course) => course._id !== selectedCourse._id)
            )
            
            setConfirmDeleteCourseValue('')
            setLoadingCourseId(null)

            toast.success(`${course.title} was deleted`, {
                id: toastId,
                position: "top-right",
                action: null
            })
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
            <CardContent className="pb-5">
                <div className="overflow-x-auto">
                    { courses && courses.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/2">Course</TableHead>
                                    <TableHead className="w-1/6">Students</TableHead>
                                    <TableHead className="w-1/6">Price</TableHead>
                                    <TableHead className="w-1/11">Revenue</TableHead>
                                    <TableHead className="w-1/6 text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                { courses?.map((course) => (
                                    <TableRow key={course?._id} className="text-base font-mono">
                                        { loadingCourseId === course?._id ? (
                                            <></>
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
                                                        disabled={loadingCourseId}
                                                        onClick={() => navigate(`/instructor/edit-course/${course?._id}`)}
                                                    >
                                                        <Edit className="h-6 w-6" />
                                                    </Button>
                                                    <Dialog open={open} onOpenChange={setOpen} tabindex="-1">
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="transparent"
                                                                disabled={loadingCourseId}
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
                                                            className="sm:w-[425px]"
                                                        >
                                                            <DialogTitle className="font-semibold text-xl">
                                                                { selectedCourse?.title }
                                                            </DialogTitle>
                                                            <div className="font-medium mt-3 mb-1 ml-0.5 cursor-default">
                                                                <p>
                                                                    Are you sure you want to delete this course?    
                                                                </p>
                                                                <Input
                                                                    value={confirmDeleteCourseValue}
                                                                    onChange={(e) => setConfirmDeleteCourseValue(e.target.value)}
                                                                    placeholder="Type the course name to proceed"
                                                                    className="my-2 ml-[-5px]"
                                                                />

                                                                { confirmDeleteCourseValue === selectedCourse?.title && (
                                                                    <DialogDescription id="delete-description" className="absolute text-red-700 duration-300">
                                                                        { selectedCourse?.students?.length > 0 ? (
                                                                            `${selectedCourse?.students?.length} 
                                                                             ${selectedCourse?.students?.length > 1 
                                                                                ? 'Students' 
                                                                                : 'Student'
                                                                             } 
                                                                                will no longer have access to this course` 
                                                                        ) : (
                                                                            <>
                                                                                This cannot be undone
                                                                            </>
                                                                        )}
                                                                    </DialogDescription>
                                                                )}
                                                            </div>
                                                            <div className="flex justify-end space-x-2 mt-5">
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