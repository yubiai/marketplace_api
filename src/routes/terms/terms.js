const express = require("express");
const router = express.Router();

const termsController = require("../../controllers/terms.controller");

router.route("/").get(termsController.getTermsLast);

module.exports = router;
