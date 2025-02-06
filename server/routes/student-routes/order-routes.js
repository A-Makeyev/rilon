const { createOrder, capturePaymentAndFinalizeOrder } = require('../../controllers/student/order-controller')
const express = require('express')


const router = express.Router()

router.post('/create-order', createOrder)
router.post('/capture-payment', capturePaymentAndFinalizeOrder)

module.exports = router