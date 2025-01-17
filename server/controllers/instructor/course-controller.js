const Course = require('../../models/Course')


const addNewCourse = async(req, res) => {
    try {
        const data = req.body
        const course = new Course(data)
        const newCourse = await course.save()

        if (newCourse) {
            res.status(201).json({
                success: true,
                message: 'Created New Course',
                data: newCourse
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const getAllCourses = async(req, res) => {
    try {
        const courses = await Course.find({})

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

const getCourse = async(req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findById(id)

        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course Not Found'
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

const updateCourse = async(req, res) => {
    try {
        const { id } = req.params
        const newCourseData = req.body
        const updatedCourse = await Course.findByIdAndUpdate(id, newCourseData)

        if (!updatedCourse) {
            res.status(404).json({
                success: false,
                message: 'Course Not Found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Updated Course',
            data: updatedCourse
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

module.exports = { 
    addNewCourse, 
    getAllCourses, 
    getCourse, 
    updateCourse
}