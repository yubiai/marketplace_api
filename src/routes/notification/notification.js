const express = require("express");
const router = express.Router();

const notiController = require("../../controllers/notification.controller");

router.route("/all/:userID").get(notiController.updateSeenAllByUserId);
router.route("/seen/true").put(notiController.updateSeenById);
router.route("/seen/false/:userID").get(notiController.getNotiSeenFalse);
router.route("/:userID").get(notiController.getNotiByUserId);

module.exports = router;
