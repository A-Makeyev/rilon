import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth/index.js'
import instructorMediaRoutes from './routes/instructor-routes/media-routes.js'
import instructorCourseRoutes from './routes/instructor-routes/course-routes.js'
import studentCourseRoutes from './routes/student-routes/course-routes.js'
import studentOrderRoutes from './routes/student-routes/order-routes.js'
import acquiredCoursesRoutes from './routes/student-routes/acquired-courses-routes.js'
import courseProgressRoutes from './routes/student-routes/course-progress-routes.js'


config()
const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('>>> Connected to MongoDB'))
    .catch((err) => console.log(err))

app.use('/auth', authRoutes)
app.use('/media', instructorMediaRoutes)
app.use('/instructor/courses', instructorCourseRoutes)
app.use('/student/courses', studentCourseRoutes)
app.use('/student/order', studentOrderRoutes)
app.use('/student/acquired-courses', acquiredCoursesRoutes)
app.use('/student/course-progress', courseProgressRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, '..', 'client', 'dist')))
    app.get('*', (req, res) => res.sendFile(resolve(__dirname, '..', 'client', 'dist', 'index.html')))
} else {
    app.get('/', (req, res) => res.send('<h1 style="text-align: center margin-top: 20%">Server is Running</h1>'))
}

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