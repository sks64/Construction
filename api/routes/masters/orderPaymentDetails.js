const express = require('express');
const router = express.Router();
const orderpaymentDetailsMasterService = require('../../services/masters/orderPaymentDetails');

router
    .post('/get', orderpaymentDetailsMasterService.get)
    .post('/create', orderpaymentDetailsMasterService.create)
    .post('/makePayment', orderpaymentDetailsMasterService.makePayment)
    .put('/update', orderpaymentDetailsMasterService.update)


module.exports = router;