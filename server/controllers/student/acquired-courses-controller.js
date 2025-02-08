const StudentCourses = require('../../models/StudentCourses')


const getAcquiredCourses = async (req, res) => {
    try {
        const { studentId } = req.params
        const acquiredCourses = await StudentCourses.findOne({ userId: studentId })

        res.status(200).json({
            success: true,
            data: acquiredCourses.courses
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = { getAcquiredCourses }