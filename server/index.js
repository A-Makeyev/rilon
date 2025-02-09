require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const authRoutes = require('./routes/auth/index')
const instructorMediaRoutes = require('./routes/instructor-routes/media-routes')
const instructorCourseRoutes = require('./routes/instructor-routes/course-routes')
const studentCourseRoutes = require('./routes/student-routes/course-routes')
const studentOrderRoutes = require('./routes/student-routes/order-routes')
const acquiredCoursesRoutes = require('./routes/student-routes/acquired-courses-routes')
const courseProgressRoutes = require('./routes/student-routes/course-progress-routes')


const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
mongoose.connect(MONGODB_URI)
    .then(() => console.log('>>> Connected to MongoDB'))
    .catch((err) => console.log(err))

app.use('/auth', authRoutes)
app.use('/media', instructorMediaRoutes)
app.use('/instructor/courses', instructorCourseRoutes)
app.use('/student/courses', studentCourseRoutes)
app.use('/student/order', studentOrderRoutes)
app.use('/student/acquired-courses', acquiredCoursesRoutes)
app.use('/student/course-progress', courseProgressRoutes)

app.use((err, req, res, next) => {
    console.log('🥞', err.stack)
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    })
})

app.listen(PORT, () => {
    console.log(`>>> Server is running on port ${PORT}`)
})
