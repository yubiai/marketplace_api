const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/profile.controller");

router.route("/:eth_address").get(profileController.getProfile);

router.route("/id/:userID").get(profileController.getProfileFromId);

router.route("/id/:userID").put(profileController.updateProfile);

router.route("/id/:userID").delete(profileController.deleteProfile);

router.route("/favourites/:userID").get(profileController.getFavorites);

router.route("/favourites/:userID").put(profileController.updateFavorites);

router.route("/my_purchases/:userID").get(profileController.getMyPurchases);

router.route("/my_published/:userID").get(profileController.getMyPublished);

router.route("/terms/:userID").put(profileController.addTerms);

router.route("/touraccepted/:userID").put(profileController.tourAccepted);

module.exports = router;
