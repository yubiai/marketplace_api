const express = require("express");
const router = express.Router();

const itemeditController = require("../../controllers/itemedit.controller");

// Security
router.route("/id/:id").put(itemeditController.updateItem); 
router.route("/deletefile/:id").put(itemeditController.deleteFileById);

module.exports = router;
