const { getAcquiredCourses } = require('../../controllers/student/acquired-courses-controller')
const express = require('express')


const router = express.Router()

router.get('/:studentId', getAcquiredCourses)

module.exports = router