const express = require("express");
const router = express.Router();

const msgfeedbackController = require("../../controllers/msgfeedback.controller");

router.route("/").post(msgfeedbackController.newMessageFeedback);

module.exports = router;
