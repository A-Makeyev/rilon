const paypal = require("../../helpers/paypal")
const Order = require("../../models/Order")
const Course = require("../../models/Course")
const StudentCourses = require("../../models/StudentCourses")


const createOrder = async (req, res) => {
    try {
        const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_PROD_URL : process.env.CLIENT_URL
        const {
            payerId,
            paymentId,
            userId,
            userName,
            userEmail,
            orderStatus,
            paymentMethod,
            paymentStatus,
            orderDate,
            instructorId,
            instructorName,
            courseImage,
            courseTitle,
            courseId,
            coursePrice,
            courseCategory
        } = req.body

        const createPaymentJson = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: `${clientUrl}/payment-return`,
                cancel_url: `${clientUrl}/payment-cancel`,
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: courseTitle,
                                sku: courseId,
                                price: coursePrice,
                                currency: 'ILS',
                                quantity: 1,
                            },
                        ],
                    },
                    amount: {
                        currency: 'ILS',
                        total: coursePrice.toFixed(2)
                    },
                    description: courseCategory
                }
            ]
        }

        paypal.payment.create(createPaymentJson, async (err, paymentInfo) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error creating paypal payment',
                })
            } else {
                const newlyCreatedCourseOrder = new Order({
                    payerId,
                    paymentId,
                    userId,
                    userName,
                    userEmail,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    orderDate,
                    instructorId,
                    instructorName,
                    courseImage,
                    courseTitle,
                    courseId,
                    coursePrice,
                    courseCategory
                })

                await newlyCreatedCourseOrder.save()
                const approvalUrl = paymentInfo.links.find(link => link.rel === 'approval_url').href

                res.status(201).json({
                    success: true,
                    data: {
                        approvalUrl,
                        orderId: newlyCreatedCourseOrder._id,
                    }
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

const capturePaymentAndFinalizeOrder = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body

        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order Not Found'
            })
        }

        order.paymentStatus = 'paid'
        order.orderStatus = 'confirmed'
        order.paymentId = paymentId
        order.payerId = payerId

        await order.save()
        const studentCourses = await StudentCourses.findOne({ userId: order.userId })

        if (studentCourses) {
            studentCourses.courses.push({
                courseId: order.courseId,
                title: order.courseTitle,
                instructorId: order.instructorId,
                instructorName: order.instructorName,
                purchaseDate: order.orderDate,
                courseImage: order.courseImage,
                courseCategory: order.courseCategory
            })

            await studentCourses.save()
        } else {
            const newStudentCourses = new StudentCourses({
                userId: order.userId,
                courses: [
                    {
                        courseId: order.courseId,
                        title: order.courseTitle,
                        instructorId: order.instructorId,
                        instructorName: order.instructorName,
                        purchaseDate: order.orderDate,
                        courseImage: order.courseImage,
                        courseCategory: order.courseCategory
                    }
                ]
            })

            await newStudentCourses.save()
        }

        await Course.findByIdAndUpdate(order.courseId, {
            $addToSet: {
                students: {
                    studentId: order.userId,
                    studentName: order.userName,
                    studentEmail: order.userEmail,
                    paidAmount: order.coursePrice
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Order Confirmed',
            data: order
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Some Error Occured!'
        })
    }
}

module.exports = {
    createOrder,
    capturePaymentAndFinalizeOrder
}