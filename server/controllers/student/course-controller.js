const Course = require('../../models/Course')


const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({})

        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No courses found',
                data: []
            }) 
        }

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

module.exports = {
    getCourses,
    getCourseDetails
}