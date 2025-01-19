const { addNewCourse, getAllCourses, getCourseDetails, updateCourse } = require('../../controllers/instructor/course-controller')
const express = require('express')


const router = express.Router()

router.post('/new', addNewCourse)
router.get('/all', getAllCourses)
router.get('/details/:id', getCourseDetails)
router.put('/update/:id', updateCourse)


module.exports = router