const express = require('express');
const router = express.Router();
const branchMasterService = require('../../services/masters/orderDetails');

router
    .post('/get', branchMasterService.get)
    .post('/create', branchMasterService.create)
    .put('/update', branchMasterService.update)


module.exports = router;