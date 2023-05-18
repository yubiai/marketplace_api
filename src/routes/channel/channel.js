const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(
            null,
            "./upload/"
        );
    },
    filename: (req, file, cb) => {
        const match = ["image/png", "image/jpg", "image/jpeg", "video/mp4", "audio/mpeg", "application/pdf"];
        if (match.indexOf(file.mimetype) === -1) {
            const message = `<strong>${file.originalname}</strong> is invalid. Only accept png/jpeg/jpg/mp3/mp4/pdf.`;
            console.error(message)
            return cb(message, false);
        }

        const filename = `${Date.now()}-${file.originalname}`;

        cb(null, filename);
    },
});

const upload = multer({ storage: storage });


const channelController = require("../../controllers/channel.controller");

router.route("/").post(channelController.newChannel);

router.route("/pushmsg/:id").post(channelController.pushMsg);

router.route("/pushmsgwithfiles/:id").post(upload.array("files"), channelController.pushMsgWithFiles);

router.route("/channels/buyer/:id").get(channelController.getChannelsBuyerByProfile);

router.route("/channels/seller/:id").get(channelController.getChannelsSellerByProfile);

router.route("/orderID/:id").get(channelController.getChannelByOrderId);

router.route("/messagesbyorder/:id").get(channelController.getMessagesByOrderId);

router.route("/:id").get(channelController.getChannel);

module.exports = router;
