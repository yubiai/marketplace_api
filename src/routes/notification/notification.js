const express = require("express");
const router = express.Router();

const notiController = require("../../controllers/notification.controller");

router.route("/:userID").get(notiController.getNotiByUserId);
router.route("/seen/:notiID").get(notiController.updateSeenById);
router.route("/seen/false/:userID").get(notiController.getNotiSeenFalse);
router.route("/seen/all/:userID").put(notiController.updateSeenAllByUserId);

module.exports = router;
