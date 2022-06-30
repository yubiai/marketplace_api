const getPagination = require("../libs/getPagination");
const { Order, Transaction } = require("../models/Order");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const ObjectId = require("mongoose").Types.ObjectId;
const useRabbit = require("../libs/useRabbit");

async function createTransaction(transactionData) {
  const transaction = new Transaction({
    ...transactionData,
  });
  return await transaction.save();
}

async function createOrder(req, res) {
  try {
    const { transactionInfo, order } = req.body;
    const transactionCreated = await createTransaction({ ...transactionInfo });
    const { itemId, userBuyer, userSeller, status } = order;

    const orderCreated = new Order({
      itemId: ObjectId(itemId),
      userBuyer,
      userSeller,
      status,
      transactionHash: transactionCreated.transactionHash,
    });

    await orderCreated.save();

    // Noti seller
    useRabbit("notifications", {
      user_id: userSeller,
      type: "Sale",
      message: "New Sale!",
      path: "as-seller",
      reference: transactionCreated.transactionHash
    });

    res.status(200).json({ result: orderCreated });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

/**
 * Possible values for order status:
 * - ORDER_CREATED
 * - ORDER_PAID
 * - ORDER_DISPUTE_RECEIVER_FEE_PENDING
 * - ORDER_DISPUTE_IN_PROGRESS
 * - ORDER_DISPUTE_FINISHED
 * - ORDER_DISPUTE_APPEALABLE
 */
async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;

    if (req.params.transactionId) {
      const result = await Order.findOneAndUpdate(
        {
          transactionHash: req.params.transactionId,
        },
        { status }
      );

      res.status(200).json({
        status: "ok",
        result,
      });
    } else {
      res.status(404).json({
        message: "Order not found",
        error: error,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error on order",
      error: error,
    });
  }
}

async function setDisputeOnOrderTransaction(req, res) {
  try {
    const { disputeId } = req.body;

    if (req.params.transactionId) {
      const result = await Transaction.findOneAndUpdate(
        {
          transactionHash: req.params.transactionId,
        },
        { disputeId }
      );

      res.status(200).json({
        status: "ok",
        result,
      });
    } else {
      res.status(404).json({
        message: "Transaction not found",
        error: error,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error on transaction",
      error: error,
    });
  }
}

async function getOrderByTransaction(req, res) {
  try {
    let order = {};
    let transaction = {};
    let result = {};

    if (req.params.transactionId) {
      order = await Order.findOne({
        transactionHash: req.params.transactionId,
      });
      transaction = await Transaction.findOne({
        transactionHash: req.params.transactionId,
      });

      const { itemId, userBuyer, userSeller, dateOrder, _id, status } = order;
      const { transactionHash, transactionIndex, to, disputeId } = transaction;
      const item = await Item.findOne({ _id: itemId }).lean()
      const seller = await Profile.findOne({ eth_address: userSeller }).lean()

      result = {
        _id,
        item: {
          ...item,
          seller
        },
        userBuyer,
        userSeller,
        dateOrder,
        status,
        transaction: {
          transactionHash,
          transactionIndex,
          to,
          disputeId
        },
      };
    }

    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (error) {
    res.status(404).json({
      message: "Order not found",
      error: error,
    });
  }
}

async function getOrdersByBuyer(req, res) {
  const { eth_address_buyer } = req.params;
  const { size, page } = req.query;
  const { limit, offset } = getPagination(page, size);
  const sort = { createdAt: -1 };

  try {

    if (!eth_address_buyer) {
      return res.status(404).json({ error: "Data not exists" });
    }

    let condition = {userBuyer:{'$regex': `${eth_address_buyer}$`, $options: 'i'}}

    const data = await Order.paginate(condition, { offset, limit, sort })

    return res.status(200).json({
      totalItems: data.totalDocs,
      items: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
      prevPage: data.prevPage - 1,
      nextPage: data.nextPage - 1,
    });

  } catch (error) {
    res.status(400).json({
      message: "Error in orders",
      error: error,
    });
  }
}

async function getOrdersBySeller(req, res) {
  const { eth_address_seller } = req.params;
  const { size, page } = req.query;
  const { limit, offset } = getPagination(page, size);
  const sort = { createdAt: -1 };

  try {

    if (!eth_address_seller) {
      return res.status(404).json({ error: "Data not exists" });
    }

    let condition = {userSeller:{'$regex': `${eth_address_seller}$`, $options: 'i'}}

    const data = await Order.paginate(condition, { offset, limit, sort })


    return res.status(200).json({
      totalItems: data.totalDocs,
      items: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
      prevPage: data.prevPage - 1,
      nextPage: data.nextPage - 1,
    });

  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: "Error in orders",
      error: error,
    });
  }
}

module.exports = {
  createOrder,
  getOrderByTransaction,
  updateOrderStatus,
  getOrdersByBuyer,
  getOrdersBySeller,
  setDisputeOnOrderTransaction
};
