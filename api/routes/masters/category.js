const express = require("express");
const router = express.Router();
const categoryMasterService = require("../../services/masters/category");

router

  .post("/get", categoryMasterService.get)
  .post("/create", categoryMasterService.create)
  .put("/update", categoryMasterService.update);

module.exports = router;
