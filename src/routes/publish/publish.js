const express = require("express");
const router = express.Router();
const multer = require("multer");

const publishController = require("../../controllers/publish.controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      "./upload/"
    );
  },
  filename: (req, file, cb) => {
    const match = ["image/png", "image/jpg", "image/jpeg", "video/mp4", "audio/mpeg"];
    console.log(file.mimetype, "file.mimetype")
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

router.route("/").post(upload.array("files"), publishController.newItem);
router.route("/published/").put(publishController.publishItem);

module.exports = router;
