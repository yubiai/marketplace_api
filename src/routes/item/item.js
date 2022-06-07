const express = require("express");
const router = express.Router();
const multer = require("multer");

const itemController = require("../../controllers/item.controller");

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

router.route("/").get(itemController.getItems);

router
  .route("/item")
  .get(itemController.getItem)
  .post(upload.array("file"), itemController.postItem);

router.route("/new").post(upload.array("file"), itemController.newItem);

router.route("/item/:slug").get(itemController.getItemSlug);

router.route("/search/").get(itemController.search);

router.route("/getPaymentId/:itemId").get(itemController.getPaymendId);

router.route("/getItemUrl/:paymentId").get(itemController.getItemUrl);

module.exports = router;
