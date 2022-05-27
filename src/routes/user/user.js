const express = require("express");
const router = express.Router();

const userController = require("../../controllers/user.controller");

router.route("/:userID").get(userController.getUserById);

module.exports = router;
