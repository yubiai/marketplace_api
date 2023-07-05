const express = require("express");
const router = express.Router();
const multer = require("multer");

const profileController = require("../../controllers/profile.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(
            null,
            "./upload/"
        );
    },
    filename: (req, file, cb) => {
        const match = ["image/png", "image/jpg", "image/jpeg", "image/webp", "video/mp4", "audio/mpeg"];
        if (match.indexOf(file.mimetype) === -1) {
            const message = `<strong>${file.originalname}</strong> is invalid. Only accept png/jpeg/jpg/mp3/mp4.`;
            console.error(message)
            return cb(message, false);
        }

        const filename = `${Date.now()}-${file.originalname}`;

        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

router.route("/:eth_address").get(profileController.getProfile);

router.route("/id/:userID").get(profileController.getProfileFromId);

router.route("/id/:userID").put(upload.array("files"), profileController.updateProfile);

router.route("/id/:userID").delete(profileController.deleteProfile);

router.route("/favourites/:userID").get(profileController.getFavorites);

router.route("/favourites/:userID").put(profileController.updateFavorites);

router.route("/my_purchases/:userID").get(profileController.getMyPurchases);

router.route("/my_published/:userID").get(profileController.getMyPublished);

router.route("/terms/:userID").put(profileController.addTerms);

router.route("/touraccepted/:userID").put(profileController.tourAccepted);

router.route("/verifyprotocol/:userID").put(profileController.verifyProtocol);

module.exports = router;
