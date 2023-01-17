const getPagination = require("../libs/getPagination");
const { Order, Transaction } = require("../models/Order");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const ObjectId = require("mongoose").Types.ObjectId;
const { Notification } = require("../models/Notifications");

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
      transactionHash: transactionCreated.transactionMeta.transactionHash,
    });

    await orderCreated.save();

    // Get User Seller
    const profile = await Profile.findOne({
      eth_address: userSeller.toUpperCase()
    })

    // Noti seller
    const newNotification = new Notification({
      user_id: profile._id,
      type: "Sale",
      reference: transactionCreated.transactionMeta.transactionHash
    });

    await newNotification.save();

    return res.status(200).json({ result: orderCreated });
  } catch (error) {
    console.log(error, "error");
    return res.status(400).json({
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

      // Get User Seller
      const profileSeller = await Profile.findOne({
        eth_address: result.userSeller.toUpperCase()
      })

      // Get User Seller
      const profileBuyer = await Profile.findOne({
        eth_address: result.userBuyer.toUpperCase()
      })

      if (status === "ORDER_PAID") {
        // Noti seller Order Paid
        const newNotification = new Notification({
          user_id: profileSeller._id,
          type: status,
          reference: result.transactionHash
        });

        await newNotification.save();
      }

      if (status === "ORDER_DISPUTE_RECEIVER_FEE_PENDING") {
        // Noti seller
        const newNotification = new Notification({
          user_id: profileSeller._id,
          type: status,
          reference: result.transactionHash
        });

        await newNotification.save();
      }

      if (status === "ORDER_DISPUTE_IN_PROGRESS") {
        // Noti seller
        const newNotification = new Notification({
          user_id: profileBuyer._id,
          type: status,
          reference: result.transactionHash
        });

        await newNotification.save();
      }

      if (status === "ORDER_DISPUTE_FINISHED") {
        // Noti Buyer
        const newNotiBuyer = new Notification({
          user_id: profileBuyer._id,
          type: "ORDER_DISPUTE_IN_PROGRESS_BUYER",
          reference: result.transactionHash
        });

        await newNotiBuyer.save();

        // Noti Seller
        const newNotiSeller = new Notification({
          user_id: profileSeller._id,
          type: "ORDER_DISPUTE_FINISHED_SELLER",
          reference: result.transactionHash
        });

        await newNotiSeller.save();
      }

      if (status === "ORDER_DISPUTE_APPEALABLE") {
        // Noti seller
        const newNotification = new Notification({
          user_id: profileSeller._id,
          type: status,
          reference: result.transactionHash
        });

        await newNotification.save();
      }

      return res.status(200).json({
        status: "ok",
        result,
      });
    } else {
      return res.status(404).json({
        message: "Order not found",
        error: error,
      });
    }
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Error on order",
      error: error,
    });
  }
}

async function updateOrderCompletedBySeller(req, res) {
  try {
    const { orderCompletedBySeller } = req.body;

    if (!req.params.transactionId) {
      return res.status(404).json({
        message: "Transaction Id is missing."
      });
    }

    const verifyOrder = await Order.findOne(
      {
        transactionHash: req.params.transactionId,
      }
    );

    if (!verifyOrder) {
      return res.status(400).json({
        message: "Order is missing."
      });
    };

    const buyer = await Profile.findOne({ eth_address: verifyOrder.userBuyer.toUpperCase() }).lean();

    const result = await Order.findOneAndUpdate(
      {
        transactionHash: req.params.transactionId
      },
      { orderCompletedBySeller: orderCompletedBySeller }
    );

    if (result) {
      // Noti Buyer
      const newNotification = new Notification({
        user_id: buyer._id,
        type: "ORDER_COMPLETED_BY_SELLER",
        reference: verifyOrder.transactionHash
      });

      await newNotification.save();
    }

    return res.status(200).json({
      status: "ok",
      result
    });
  } catch (error) {
    console.error(error)
    return res.status(400).json({
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
        'transactionMeta.transactionHash': req.params.transactionId,
      });

      const { itemId, userBuyer, userSeller, dateOrder, _id, status, orderCompletedBySeller } = order;
      const {
        transactionHash,
        transactionIndex,
        to,
        disputeId,
        transactionPayedAmount,
        transactionFeeAmount,
        transactionDate,
        networkEnv,
        transactionMeta,
        timeForClaim
      } = transaction;
      const item = await Item.findOne({ _id: itemId }).lean().populate({
        path: 'files',
        model: 'File',
        select: { filename: 1, mimetype: 1 }
      });
      const seller = await Profile.findOne({ eth_address: userSeller.toUpperCase() }).lean();
      const buyer = await Profile.findOne({ eth_address: userBuyer.toUpperCase() }).lean();

      result = {
        _id,
        item: {
          ...item,
          seller,
          buyer,
        },
        userBuyer,
        userSeller,
        dateOrder,
        status,
        orderCompletedBySeller,
        transaction: {
          transactionHash,
          transactionIndex,
          to,
          disputeId,
          transactionPayedAmount,
          transactionFeeAmount,
          transactionDate,
          networkEnv,
          timeForClaim,
          transactionMeta
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

async function getOrderByOrderId(req, res) {
  try {
    let order = {};
    let transaction;
    let result = {};

    if (req.params.orderId) {
      order = await Order.findById(req.params.orderId);
      transaction = await Transaction.findOne({
        'transactionMeta.transactionHash': order.transactionHash,
      });

      const { itemId, userBuyer, userSeller, dateOrder, _id, status } = order;
      const {
        transactionHash,
        transactionIndex,
        to,
        disputeId,
        transactionPayedAmount,
        transactionFeeAmount,
        transactionDate,
        networkEnv,
        transactionMeta,
        timeForClaim
      } = transaction;
      const item = await Item.findOne({ _id: itemId }).lean().populate({
        path: 'files',
        model: 'File',
        select: { filename: 1, mimetype: 1 }
      });
      const seller = await Profile.findOne({ eth_address: userSeller.toUpperCase() }).lean();
      const buyer = await Profile.findOne({ eth_address: userBuyer.toUpperCase() }).lean();

      result = {
        _id,
        item: {
          ...item,
          seller,
          buyer,
        },
        userBuyer,
        userSeller,
        dateOrder,
        status,
        transaction: {
          transactionHash,
          transactionIndex,
          to,
          disputeId,
          transactionPayedAmount,
          transactionFeeAmount,
          transactionDate,
          networkEnv,
          timeForClaim,
          transactionMeta
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

    let condition = {
      userBuyer: { $regex: `${eth_address_buyer}$`, $options: "i" },
    };

    let data = await Order.paginate(condition, {
      offset, limit, sort, populate: {
        path: 'itemId',
        model: 'Item',
        select: 'title slug seller files',
        populate: [
          {
            path: 'seller', model: 'Profile', select: 'first_name last_name'
          },
          {
            path: 'files', model: 'File', select: 'filename'
          }
        ]
      }
    });
    const newData = [];
    for (let item of data.docs) {
      const transaction = await Transaction.findOne({
        'transactionMeta.transactionHash': item.transactionHash,
      }).lean();

      const {
        _id,
        itemId,
        userBuyer,
        userSeller,
        status,
        dateOrder,
        createdAt,
      } = item;

      newData.push({
        _id,
        itemId,
        userBuyer,
        userSeller,
        status,
        dateOrder,
        createdAt,
        transaction,
        transactionHash: item.transactionHash
      });
    }

    return res.status(200).json({
      totalItems: data.totalDocs,
      items: newData,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
      prevPage: data.prevPage - 1,
      nextPage: data.nextPage - 1,
    });
  } catch (error) {
    console.error(error)
    return res.status(400).json({
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

  console.log(eth_address_seller, "eth_address_seller")

  try {
    if (!eth_address_seller) {
      console.error("Eth address seller is missing.")
      return res.status(404).json({ error: "Data not exists" });
    }

    let condition = {
      userSeller: { $regex: `${eth_address_seller}$`, $options: "i" },
    };

    let data = await Order.paginate(condition, {
      offset, limit, sort, populate: {
        path: 'itemId',
        model: 'Item',
        select: 'title slug files',
        populate: [
          {
            path: 'files', model: 'File', select: 'filename'
          }
        ]
      }
    });

    const newData = [];
    for (let item of data.docs) {
      const transaction = await Transaction.findOne({
        'transactionMeta.transactionHash': item.transactionHash,
      }).lean();

      const {
        _id,
        itemId,
        userBuyer,
        userSeller,
        status,
        dateOrder,
        createdAt,
      } = item;

      newData.push({
        _id,
        itemId,
        userBuyer,
        userSeller,
        status,
        dateOrder,
        createdAt,
        transaction,
        transactionHash: item.transactionHash
      });
    }

    console.log(data.totalDocs, "data.totalDocs orders sales")

    return res.status(200).json({
      totalItems: data.totalDocs,
      items: newData,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
      prevPage: data.prevPage - 1,
      nextPage: data.nextPage - 1,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Error in orders",
      error: error,
    });
  }
}

module.exports = {
  createOrder,
  getOrderByTransaction,
  getOrderByOrderId,
  updateOrderStatus,
  updateOrderCompletedBySeller,
  getOrdersByBuyer,
  getOrdersBySeller,
  setDisputeOnOrderTransaction,
};
