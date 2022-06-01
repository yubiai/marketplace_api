const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/profile.controller");

router.route("/:eth_address").get(profileController.getProfile);

router.route("/login").post(profileController.login);

router.route("/:userID").put(profileController.updateProfile);

router.route("/:userID").delete(profileController.deleteProfile);

router.route("/favorites/:userID").get(profileController.getFavorites);

router.route("/favorites/:userID").put(profileController.updateFavorites);

router.route("/my_purchases/:userID").get(profileController.getMyPurchases);

router.route("/my_published/:userID").get(profileController.getMyPublished);


module.exports = router;
