const getPagination = require("../libs/getPagination");
const { Order, Transaction } = require("../models/Order");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const ObjectId = require("mongoose").Types.ObjectId;
const { Notification } = require("../models/Notifications");
const { logger } = require("../utils/logger");
const { sendNotiTargeted } = require("../utils/pushProtocolUtil");
const moment = require('moment');

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

    const resultOrder = await orderCreated.save();

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

    sendNotiTargeted(profile.eth_address.toLowerCase(), "Sale", resultOrder._id)

    await newNotification.save();

    logger.info(`New Order: ${orderCreated._id} - By ID: ${userBuyer}`)

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
        { status: status }
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
        sendNotiTargeted(profileSeller.eth_address.toLowerCase(), "ORDER_PAID", result._id)
      }

      if (status === "ORDER_REFUNDED") {
        // Noti buyer Order Refunded
        const newNotification = new Notification({
          user_id: profileBuyer._id,
          type: status,
          reference: result.transactionHash
        });

        await newNotification.save();
        sendNotiTargeted(profileBuyer.eth_address.toLowerCase(), "ORDER_REFUNDED", result._id)
      }

      if (status === "ORDER_DISPUTE_RECEIVER_FEE_PENDING") {
        // Noti seller
        const newNotification = new Notification({
          user_id: profileSeller._id,
          type: status,
          reference: result.transactionHash
        });

        await newNotification.save();
        sendNotiTargeted(profileSeller.eth_address.toLowerCase(), "ORDER_DISPUTE_RECEIVER_FEE_PENDING", result._id)

      }

      if (status === "ORDER_DISPUTE_IN_PROGRESS") {

        // Calculating dispute in kleros to warn
        // Total days
        const totalDays = process.env.JURY_TIME;

        // Get the current date
        const currentDate = moment();

        // Calculate the resulting date by adding the total days
        const resultingDate = currentDate.add(totalDays, 'days');

        // Convert the resulting date to a JavaScript Date object
        const disputeEndDate = resultingDate.toDate();

        await Order.findOneAndUpdate(
          {
            transactionHash: req.params.transactionId,
          },
          { disputeEndDate: disputeEndDate }
        );

        // Noti Buyer
        const newNotification = new Notification({
          user_id: profileBuyer._id,
          type: status,
          reference: result.transactionHash
        });

        await newNotification.save();


      }

      if (status === "ORDER_CLOSE_DEAL") {
        // Noti buyer close deal
        const newNotification = new Notification({
          user_id: profileBuyer._id,
          type: status,
          reference: result.transactionHash
        });

        await newNotification.save();
        sendNotiTargeted(profileBuyer.eth_address.toLowerCase(), "ORDER_CLOSE_DEAL", result._id)
      }

      if (status === "ORDER_DISPUTE_FINISHED") {
        // Noti Buyer
        const newNotiBuyer = new Notification({
          user_id: profileBuyer._id,
          type: "ORDER_DISPUTE_FINISHED_BUYER",
          reference: result.transactionHash
        });

        await newNotiBuyer.save();
        sendNotiTargeted(profileBuyer.eth_address.toLowerCase(), "ORDER_DISPUTE_FINISHED", result._id)


        // Noti Seller
        const newNotiSeller = new Notification({
          user_id: profileSeller._id,
          type: "ORDER_DISPUTE_FINISHED_SELLER",
          reference: result.transactionHash
        });

        await newNotiSeller.save();
        sendNotiTargeted(profileSeller.eth_address.toLowerCase(), "ORDER_DISPUTE_FINISHED", result._id)

      }

      if (status === "ORDER_DISPUTE_APPEALABLE") {
        // Noti seller
        const newNotification = new Notification({
          user_id: profileSeller._id,
          type: status,
          reference: result.transactionHash
        });

        await newNotification.save();
        sendNotiTargeted(profileSeller.eth_address.toLowerCase(), "ORDER_DISPUTE_APPEALABLE", result._id)

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
      sendNotiTargeted(buyer.eth_address.toLowerCase(), "ORDER_COMPLETED_BY_SELLER", result._id)
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
        select: 'title slug seller files orderCompletedBySeller',
        populate: [
          {
            path: 'seller', model: 'Profile', select: 'name'
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
        orderCompletedBySeller,
        dateOrder,
        createdAt,
      } = item;

      newData.push({
        _id,
        itemId,
        userBuyer,
        userSeller,
        status,
        orderCompletedBySeller,
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
        select: 'title slug files orderCompletedBySeller',
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
        orderCompletedBySeller,
        dateOrder,
        createdAt,
      } = item;

      newData.push({
        _id,
        itemId,
        userBuyer,
        userSeller,
        status,
        orderCompletedBySeller,
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
