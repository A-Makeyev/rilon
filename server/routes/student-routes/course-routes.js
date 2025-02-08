const { getCourses, getCourseDetails, getCoursePurchaseInfo } = require('../../controllers/student/course-controller')
const express = require('express')


const router = express.Router()

router.get('/all-courses', getCourses)
router.get('/course-details/:id', getCourseDetails)
router.get('/purchase-info/:id/:studentId', getCoursePurchaseInfo)

module.exports = router