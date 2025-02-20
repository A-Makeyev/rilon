const readline = require('readline')
const User = require('../models/User.js')
const Order = require('../models/Order.js')
const Course = require('../models/Course.js')
const CourseProgress = require('../models/CourseProgress.js')
const StudentCourses = require('../models/StudentCourses.js')
const users = require('../helpers/data/users.js')
const courses = require('../helpers/data/courses.js')


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const confirmAction = (message, callback) => {
    rl.question(`${message} (y/n): `, (answer) => {
        if (answer.toLowerCase() === 'y') {
            require('dotenv').config()
            require('mongoose').connect(process.env.MONGODB_URI)
                .then(() => console.log('>>> Connected to MongoDB'))
                .catch((err) => console.log(err))
            callback()
        } else {
            process.exit()
        }
    })
}

const importData = async () => {
    try {
        await User.deleteMany()
        await Course.deleteMany()

        await User.insertMany(users)
        await Course.insertMany(courses)
        // upload videos & images

        console.log('>>> DATA IMPORTED')
        process.exit()
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany()
        await Order.deleteMany()
        await Course.deleteMany()
        await StudentCourses.deleteMany()
        await CourseProgress.deleteMany()

        console.log('>>> DATA DESTROYED')
        process.exit()
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    confirmAction('Are you sure you want to delete all data? This cannot be undone.', destroyData)
} else {
    confirmAction('Are you sure you want to import new data?', importData)
}

// npm run import-data
// npm run destroy-data
