const bcrypt = require('bcryptjs')


module.exports = [
    {
        username: 'Rilon',
        email: 'admin@email.com',
        password: bcrypt.hashSync('admin', 10),
        role: 'instructor',
    },
    {
        username: 'Makeykin',
        email: 'anatoly.makeyev@gmail.com',
        password: bcrypt.hashSync('Pa$sW0rD', 10),
        role: 'student'
    },
    {
        username: 'Jilo',
        email: 'oriello.jilo@jilo.oriello',
        password: bcrypt.hashSync('1', 10),
        role: 'student'
    }

]