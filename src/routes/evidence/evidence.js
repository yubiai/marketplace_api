const express = require("express");
const router = express.Router();
const multer = require("multer");

const evidenceController = require("../../controllers/evidence.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(
            null,
            "./upload/"
        );
    },
    filename: (req, file, cb) => {
        const match = ["image/png", "image/jpg", "image/jpeg", "image/webp", "video/mp4", "audio/mpeg", "application/pdf"];
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


router.route("/:id").get(evidenceController.getEvidenceById);
router.route("/status/:id").put(evidenceController.updateStatus);
router.route("/orderID/:id").get(evidenceController.getEvidenceByOrderId);
router.route("/removeold/:id").delete(evidenceController.removeEvideceOld);
router.route("/all/dealid/:dealId").get(evidenceController.getEvidencesByDealId);
router.route("/files/orderID/:id").get(evidenceController.getFilesEvidenceByOrderId);
router.route("/new/:id").post(upload.array("files"), evidenceController.newEvidence);

module.exports = router;
