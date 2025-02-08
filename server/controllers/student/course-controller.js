const Course = require("../../models/Course")
const StudentCourses = require("../../models/StudentCourses")


const getCourses = async (req, res) => {
    try {
        const { category = [], level = [], language = [], sortBy = 'title-a-z' } = req.query
        const filters = {}
        const params = {}

        if (category.length) filters.category = { $in: category.split(',') }
        if (level.length) filters.level = { $in: level.split(',') }
        if (language.length) filters.language = { $in: language.split(',') }

        switch(sortBy) {
            case 'title-a-z':
                params.title = 1
                break
            case 'title-z-a':
                params.title = -1
                break
            case 'price-low-high':
                params.price = 1
                break
            case 'price-high-low':
                params.price = -1
                break
            default:
                params.title = 1
                break
        }

        const courses = await Course.find(filters).sort(params)

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

const getCourseDetails = async (req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findById(id)

        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course Not Found',
                data: null,
            })
        }

        res.status(200).json({
            success: true,
            data: course
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const getCoursePurchaseInfo = async (req, res) => {
    try {
        const { id, studentId } = req.params
        const acquiredCourses = await StudentCourses.findOne({ userId: studentId })
        const alreadyAcquiredCourse = acquiredCourses.courses.findIndex(item => item.courseId === id) > -1

        res.status(200).json({
            success: true,
            data: alreadyAcquiredCourse
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = {
    getCourses,
    getCourseDetails,
    getCoursePurchaseInfo
}