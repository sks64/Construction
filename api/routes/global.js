const express = require("express");
const router = express.Router();
var globalService = require("../services/global");

router
  .all("*", globalService.checkAuthorization)
  .use("/api", globalService.checkToken)

  .use("/api/form", require("./UserAccess/form"))
  .use("/api/role", require("./UserAccess/role"))
  .use("/api/roleDetails", require("./UserAccess/roleDetail"))
  // .post('/employee/login', require('../services/masters/user').login)

  .post("/user/websitelogin", require("../services/masters/user").websitelogin)
  .post("/user/login", require("../services/masters/user").login)

  //Masters
  .use("/api/user", require("./masters/user"))
  .use("/api/order", require("./masters/order"))
  .use("/api/orderDetails", require("./masters/orderDetails"))
  .use("/api/customer", require("./masters/customer"))
  .use("/api/item", require("./masters/item"))
  .use("/api/category", require("./masters/category"))
  .use("/api/orderPaymentDetails", require("./masters/orderPaymentDetails"))

  //Reports
  .use("/api/reports", require("./reports/reports"));

// upload calls
// .post("/upload/dayinImg", require("../services/global").dayinImg)

module.exports = router;
