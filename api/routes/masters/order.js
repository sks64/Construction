const express = require('express');
const router = express.Router();
const branchMasterService = require('../../services/masters/order');

router
    .post('/get', branchMasterService.get)
    .post('/create', branchMasterService.create)
    .post('/createOrder', branchMasterService.createOrder)
    .post('/updateOrder', branchMasterService.updateOrder)
    .post('/returnOrder', branchMasterService.returnOrder)
    .put('/update', branchMasterService.update)


module.exports = router;