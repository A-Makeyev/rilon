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
            return res.status(404).json({
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
                lastViewedLecture: courseProgress.lastViewedLecture,
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
        const { userId, courseId } = req.body
        const progress = await CourseProgress.findOne({ userId, courseId })

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'No Course Progress'
            })
        }

        progress.completed = false
        progress.completionDate = null
        progress.lectureProgress = []
        await progress.save()

        res.status(200).json({
            success: true,
            message: 'Course Progress Reset',
            data: progress
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const lastViewedLecture = async (req, res) => {
    try {
        const { userId, courseId, lectureId } = req.body
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
            return res.status(404).json({
                success: false,
                message: 'Course Not Found'
            })
        }

        const progress = await CourseProgress.findOne({ userId, courseId })

        if (!progress) {
            progress = new CourseProgress({
                userId,
                courseId,
                lastViewedLecture: lectureId,
                lectureProgress: [{
                    lectureId,
                    viewed: true,
                    dateViewed: new Date()
                }]
            })
            await progress.save()
        } else {
            progress.lastViewedLecture = lectureId
            await progress.save()
        }

        res.status(200).json({
            success: true,
            data: {
                courseAcquired: true,
                progress
            }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const viewLecture = async (req, res) => {
    try {
        const { userId, courseId, lectureId } = req.body

        let progress = await CourseProgress.findOne({ userId, courseId })

        if (!progress) {
            progress = new CourseProgress({
                userId,
                courseId,
                lectureProgress: [{
                    lectureId,
                    viewed: true,
                    dateViewed: new Date()
                }]
            })
            await progress.save()
        } else {
            const lectureProgress = progress.lectureProgress.find(item => item.lectureId === lectureId)

            if (lectureProgress) {
                lectureProgress.viewed = true
                lectureProgress.dateViewed = new Date()
            } else {
                progress.lectureProgress.push({
                    lectureId,
                    viewed: true,
                    dateViewed: new Date()
                })
            }
            await progress.save()
        }

        const course = await Course.findById(courseId)

        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course Not Found'
            })
        }

        const allLecturesViewed = progress.lectureProgress.length === course.curriculum.length
            && progress.lectureProgress.every(item => item.viewed)

        if (allLecturesViewed) {
            progress.completed = true
            progress.completionDate = new Date()
            await progress.save()
        }

        res.status(200).json({
            success: true,
            data: progress
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
    lastViewedLecture,
    viewLecture
}