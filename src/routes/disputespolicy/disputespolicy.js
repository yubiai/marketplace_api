const express = require("express");
const router = express.Router();

const disputespolicyController = require("../../controllers/disputespolicy.controller");

router.route("/").get(disputespolicyController.getDPolicyLast);
router.route("/accept/").post(disputespolicyController.acceptDPolicyByTransactionHash);
router.route("/verify/").put(disputespolicyController.verifyAcceptDPolicy);

module.exports = router;
