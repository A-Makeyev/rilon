const { addNewCourse, getAllCourses, getCourseDetails, updateCourse } = require('../../controllers/instructor/course-controller')
const express = require('express')


const router = express.Router()

router.post('/new-course', addNewCourse)
router.get('/all-courses', getAllCourses)
router.get('/course-details/:id', getCourseDetails)
router.put('/update-course/:id', updateCourse)


module.exports = router