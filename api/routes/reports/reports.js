const express = require('express');
const router = express.Router();
const reportService = require('../../services/reports/reports');

router

    .post('/getOverDueOrders', reportService.getOverDueOrders)
    .post('/getOrderPaymentSummary', reportService.getOrderPaymentSummary)
    .post('/getDashboardSummaryReport', reportService.getDashboardSummaryReport)
    .post('/getOrderDatewiseReport', reportService.getOrderDatewiseReport)
    .post('/getDashboardSaleReport', reportService.getDashboardSaleReport)
    .post('/topFiveSalingItem', reportService.topFiveSalingItem)
    .post('/topFiveCustomers', reportService.topFiveCustomers)

module.exports = router;