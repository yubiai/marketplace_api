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
      const { items, userBuyer } = order;

      const orderCreated = new Order({
        items,
        userBuyer,
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

async function getOrderByTransaction(req, res) {
  try {
    const order = await Order.find({
        transactionId: req.params.transactionId
    })
    res.status(200).json({
      status: 'ok',
      result: order,
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
  getOrderByTransaction
}
