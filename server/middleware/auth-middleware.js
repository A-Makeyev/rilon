const jwt = require('jsonwebtoken')


const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }

    try {
        const accessToken = authHeader.split(' ')[1]
        const payload = jwt.verify(accessToken, 'JWT_SECRET')

        req.user = payload
        next()
    } catch(err) {
        res.status(401).json({
            success: false,
            message: 'Invalid Token'
        })
    }
}

module.exports = authenticate