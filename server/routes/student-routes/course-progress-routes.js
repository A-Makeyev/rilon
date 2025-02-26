const { getCourseProgress, resetCourseProgress, lastViewedLecture, viewLecture } = require('../../controllers/student/course-progress-controller')
const express = require('express')


const router = express.Router()

router.get('/:userId/:courseId', getCourseProgress)
router.post('/reset-progress', resetCourseProgress)
router.post('/current-lecture', lastViewedLecture)
router.post('/view-lecture', viewLecture)

module.exports = router