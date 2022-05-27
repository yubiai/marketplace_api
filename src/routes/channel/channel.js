const express = require("express");
const router = express.Router();

const channelController = require("../../controllers/channel.controller");

router.route("/").post(channelController.newChannel);

router.route("/pushmsg/:id").post(channelController.pushMsg);

router.route("/:id").get(channelController.getChannel);

module.exports = router;
