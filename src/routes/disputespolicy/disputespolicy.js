const express = require("express");
const router = express.Router();

const disputespolicyController = require("../../controllers/disputespolicy.controller");

router.route("/").get(disputespolicyController.getDPolicyLast);

module.exports = router;
