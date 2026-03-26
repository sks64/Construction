const express = require('express');
const router = express.Router();
const notificationMasterService = require('../../services/masters/customer');

router

    .post('/get', notificationMasterService.get)
    .post('/getCustomers', notificationMasterService.getCustomers)
    .post('/create', notificationMasterService.create)
    .put('/update', notificationMasterService.update)

module.exports = router;