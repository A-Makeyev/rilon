const User = require("../../models/User")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const registerUser = async (req, res) => {
    const { username, email, role, password } = req.body

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (user) {
        return res.status(400).json({
            success: false,
            message: 'Username or email already exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, role, password: hashedPassword })
    await newUser.save()

    return res.status(201).json({
        success: true,
        message: `User "${newUser.username}" was created`
    })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
            success: false,
            message: 'Invalid Credentials'
        })
    }

    const accessToken = jwt.sign({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }, 'JWT_SECRET', { expiresIn: '14d' })

    return res.status(200).json({
        success: true,
        message: `User "${user.username}" logged in`,
        data: {
            accessToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        }
    })
}

module.exports = { registerUser, loginUser }