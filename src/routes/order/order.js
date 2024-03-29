const express = require("express");
const router = express.Router();

const orderController = require("../../controllers/order.controller");

router.route("/").post(orderController.createOrder);
router.route("/:transactionId").get(orderController.getOrderByTransaction);
router.route("/byorder/:orderId").get(orderController.getOrderByOrderId);
router.route("/:transactionId").put(orderController.updateOrderStatus);
router.route('/:transactionId/set-dispute').post(orderController.setDisputeOnOrderTransaction);
router.route("/completedbyseller/:transactionId").put(orderController.updateOrderCompletedBySeller);
router.route("/buyer/:eth_address_buyer").get(orderController.getOrdersByBuyer);
router.route("/seller/:eth_address_seller").get(orderController.getOrdersBySeller);


module.exports = router;
