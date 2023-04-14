const express = require("express");
const router = express.Router();

const testController = require("../../controllers/test.controller");

router.route("/metaevidence").get(testController.uploadMetaevidence);

module.exports = router;
