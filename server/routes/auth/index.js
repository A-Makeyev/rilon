const { rergisterUser } = require('../../controllers/auth')
const express = require('express')
const router = express.Router()


router.post('/register', rergisterUser)

module.exports = router