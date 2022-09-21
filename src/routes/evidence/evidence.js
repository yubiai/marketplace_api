const express = require("express");
const router = express.Router();

const evidenceController = require("../../controllers/evidence.controller");

router.route("/orderID/:id").get(evidenceController.getEvidenceByOrderId);

module.exports = router;
