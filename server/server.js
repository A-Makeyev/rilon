require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const authRoutes = require('./routes/auth/index')
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

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    })
})

app.listen(PORT, () => {
    console.log(`>>> Server is running on port ${PORT}`)
})
