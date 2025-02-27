const { getCourseProgress, resetCourseProgress, viewLecture } = require('../../controllers/student/course-progress-controller')
const express = require('express')


const router = express.Router()

router.get('/:userId/:courseId', getCourseProgress)
router.post('/reset-progress', resetCourseProgress)
router.post('/view-lecture', viewLecture)

module.exports = router