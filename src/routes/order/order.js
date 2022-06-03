const express = require("express");
const router = express.Router();

const orderController = require("../../controllers/order.controller");

router.route("/").post(orderController.createOrder);
router.route("/:transactionId").get(orderController.getOrderByTransaction);
router.route("/:transactionId").put(orderController.updateOrderStatus);

module.exports = router;
