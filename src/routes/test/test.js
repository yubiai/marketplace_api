const express = require("express");
const router = express.Router();

const testController = require("../../controllers/test.controller");
const configController = require("../../controllers/config.controller");

/* router.route("/initialbd").get(configController.initialBD);
router.route("/metaevidence").get(testController.uploadMetaevidence);
router.route("/clearevidences").get(testController.clearEvidence);
router.route("/sendpush").get(testController.testNotificationPush); */
router.route("/updatedescription").get(testController.updateItemDescriptionString);

module.exports = router;
