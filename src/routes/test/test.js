const express = require("express");
const router = express.Router();

const testController = require("../../controllers/test.controller");

router.route("/metaevidence").get(testController.uploadMetaevidence);
router.route("/clearevidences").get(testController.clearEvidence);

module.exports = router;
