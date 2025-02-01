const { getCourses, getCourseDetails } = require('../../controllers/student/course-controller')
const express = require('express')


const router = express.Router()

router.get('/all-courses', getCourses)
router.get('/course-details/:id', getCourseDetails)

module.exports = router