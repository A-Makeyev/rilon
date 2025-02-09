const { getCourseProgress, resetCourseProgress, markLectureAsViewed } = require('../../controllers/student/course-progress-controller')
const express = require('express')


const router = express.Router()

router.get('/:userId/:courseId', getCourseProgress)

module.exports = router