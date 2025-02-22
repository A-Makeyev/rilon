const mongoose = require("mongoose")
const Course = require("../../models/Course")
const Progress = require("../../models/CourseProgress")
const StudentCourses = require("../../models/StudentCourses")


const addNewCourse = async (req, res) => {
    try {
        const data = req.body
        const course = new Course(data)
        const newCourse = await course.save()

        if (newCourse) {
            res.status(201).json({
                success: true,
                message: `Created New Course ${newCourse}`,
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

const getCourses = async (req, res) => {
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

const getCourseDetails = async (req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findById(id)

        if (!course) {
            return res.status(404).json({
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

const updateCourse = async (req, res) => {
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

const deleteCourse = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
  
    try {
        const { id } = req.params

        const course = await Course.findByIdAndDelete(id).session(session)

        if (!course) {
            await session.abortTransaction()
            return res.status(404).json({ 
                success: false, 
                message: 'Course Not Found' 
            })
        }

        await StudentCourses.updateMany(
            { "courses.courseId": id },
            { $pull: { courses: { courseId: id } } }
        ).session(session)

        await Progress.deleteMany({ courseId: id }).session(session)
        await session.commitTransaction()

        res.status(200).json({ 
            success: true, 
            message: `Deleted Course ${course.title}` 
        })
    } catch (err) {
        await session.abortTransaction()
        
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error"
        })
    } finally {
      session.endSession()
    }
}

module.exports = {
    addNewCourse,
    getCourses,
    getCourseDetails,
    updateCourse,
    deleteCourse
}