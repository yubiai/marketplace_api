const express = require("express");
const router = express.Router();

const reportController = require("../../controllers/report.controller");

router.route("/").post(reportController.newReport);

module.exports = router;
