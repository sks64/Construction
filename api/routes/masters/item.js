const express = require('express');
const router = express.Router();
const itemMasterService = require('../../services/masters/item');

router

    .post('/get', itemMasterService.get)
    .post('/create', itemMasterService.create)
    .put('/update', itemMasterService.update)

module.exports = router;