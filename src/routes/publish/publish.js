const express = require("express");
const router = express.Router();
const multer = require("multer");

const publishController = require("../../controllers/publish.controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      process.env.NODE_ENV === "PROD" ? "./upload" : "./src/public/uploads/"
    );
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/").post(upload.array("file"), publishController.newItem);

module.exports = router;
