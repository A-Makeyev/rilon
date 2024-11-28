const User = require("../../models/User")
const bcrypt = require('bcryptjs')


const rergisterUser = async(req, res) => {
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

module.exports = { rergisterUser }