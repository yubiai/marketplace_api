const express = require("express");
const router = express.Router();

const authController = require("../../controllers/auth.controller");

router.route("/loginpoh").post(authController.login);

router.route("/loginlens").post(authController.loginLens);

router.route("/session").get(authController.authToken);

router.route("/nonce").get(authController.nonce);

router.route("/verifysignature").post(authController.verifySignature);


module.exports = router;
