const { Order, Transaction } = require('../models/Order');


async function createTransaction(transactionData) {
    const transaction = new Transaction({
        ...transactionData
    })
    return await transaction.save()
}

async function createOrder(req, res) {
    try {
      const { transactionInfo, order } = req.body; 
      const transactionCreated = await createTransaction({...transactionInfo});
      const { items, userBuyer, status } = order;

      const orderCreated = new Order({
        items,
        userBuyer,
        status,
        transactionHash: transactionCreated.transactionHash
      })
  
      await orderCreated.save()
  
      res.status(200).json({ result: orderCreated })
    } catch (error) {
      console.log(error)
      res.status(400).json({
        message: 'Ups Hubo un error!',
        error: error,
      })
    }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;

    if (req.params.transactionId) {
      const result = await Order.findOneAndUpdate({
        transactionHash: req.params.transactionId
      }, { status })

      res.status(200).json({
        status: 'ok',
        result
      })
    } else {
      res.status(404).json({
        message: 'Order not found',
        error: error,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: 'Error on order',
      error: error,
    })
  }
}


async function getOrderByTransaction(req, res) {
  try {
    let order = {};
    let transaction = {};
    let result = {};

    if (req.params.transactionId) {
      order = await Order.findOne({
        transactionHash: req.params.transactionId
      })
      transaction = await Transaction.findOne({
        transactionHash: req.params.transactionId
      })

      const { items, userBuyer, dateOrder, _id, status } = order;
      const { transactionHash, transactionIndex, to } = transaction;

      result = {
        _id,
        items,
        userBuyer,
        dateOrder,
        status,
        transaction: {
          transactionHash,
          transactionIndex,
          to
        }
      };
    }

    res.status(200).json({
      status: 'ok',
      result
    })
  } catch (error) {
    res.status(404).json({
      message: 'Order not found',
      error: error,
    })
  }
}

module.exports = {
  createOrder,
  getOrderByTransaction,
  updateOrderStatus
}