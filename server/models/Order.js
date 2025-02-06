const mongoose = require("mongoose")


const OrderSchema = new mongoose.Schema({
    paymentId: String,
    payerId: String,
    userId: String,
    userName: String,
    userEmail: String,
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    orderDate: Date,
    instructorId: String,
    instructorName: String,
    courseImage: String,
    courseTitle: String,
    courseId: String,
    coursePrice: String
})

module.exports = mongoose.model('Order', OrderSchema)