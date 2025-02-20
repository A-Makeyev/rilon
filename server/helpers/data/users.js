const bcrypt = require('bcryptjs')


module.exports = [
    {
        username: 'Admin',
        email: 'admin@email.com',
        password: bcrypt.hashSync('admin', 12),
        role: 'instructor',
    },
    {
        username: 'AnatolyMakeyev',
        email: 'anatoly.makeyev@cloudbeat.io',
        password: bcrypt.hashSync('Pa$sW0rD', 10),
        role: 'student'
    },
    {
        username: 'AvitalShtivelberg',
        email: 'tallishtiv@gmail.com',
        password: bcrypt.hashSync('ASH1997', 10),
        role: 'student'
    }
]