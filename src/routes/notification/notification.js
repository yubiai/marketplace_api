const express = require("express");
const router = express.Router();

const notiController = require("../../controllers/notification.controller");

router.route("/:userID").get(notiController.getNotiByUserId);
router.route("/seen/:notiID").get(notiController.updateSeenById);

module.exports = router;
