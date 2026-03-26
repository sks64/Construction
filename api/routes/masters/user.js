const express = require('express');
const router = express.Router();
const userMasterService = require('../../services/masters/user');

router
    .post('/get', userMasterService.get)
    .post('/create', userMasterService.create)
    .put('/update', userMasterService.update)
    .post('/createUser', userMasterService.createUser)
    .post('/changePassword', userMasterService.changePassword)
    .post('/logoutWebsite', userMasterService.logoutWebsite)
    .post('/logout', userMasterService.logout)
    // .post('/getEmployeeData', userMasterService.getEmployeeData)


module.exports = router;