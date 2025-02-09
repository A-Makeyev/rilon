const Course = require("../../models/Course")
const StudentCourses = require("../../models/StudentCourses")
const CourseProgress = require("../../models/CourseProgress")

const getCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.params
        const acquiredCourses = await StudentCourses.findOne({ userId })
        const courseAcquired = acquiredCourses.courses.findIndex(item => item.courseId === courseId) > -1

        if (!courseAcquired) {
            return res.status(200).json({
                success: true,
                message: 'Course Not Acquired',
                data: {
                    courseAcquired: false
                }
            })
        }

        const course = await Course.findById(courseId)

        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course Not Found'
            })
        }

        const courseProgress = await CourseProgress.findOne({ userId, courseId })

        if (!courseProgress || courseProgress.lectureProgress.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No Course Progress',
                data: {
                    courseAcquired: true,
                    courseDetails: course,
                    progress: []
                }
            })
        }

        res.status(200).json({
            success: true,
            data: {
                courseAcquired: true,
                courseDetails: course,
                progress: courseProgress.lectureProgress,
                completionDate: courseProgress.completionDate,
                completed: courseProgress.completed
            }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const resetCourseProgress = async (req, res) => {
    try {

        res.status(200).json({
            success: true,
            data: courses
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const markLectureAsViewed = async (req, res) => {
    try {

        res.status(200).json({
            success: true,
            data: courses
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = {
    getCourseProgress,
    resetCourseProgress,
    markLectureAsViewed
}