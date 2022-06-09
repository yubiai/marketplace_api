const { Channel } = require("../models/Channel");
const ObjectId = require("mongoose").Types.ObjectId;

async function getChannel(req, res) {
  const { id } = req.params;

  try {
    const channel = await Channel.findById(id);

    res.status(200).json({
      status: "ok",
      result: channel,
    });
  } catch (error) {
    res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

async function getChannelByOrderId(req, res) {
  const { id } = req.params;

  try {
    const channel = await Channel.findOne({
      order_id: id
    })
    .populate("buyer", "first_name last_name photo eth_address")
    .populate("seller", "first_name last_name photo eth_address")

    res.status(200).json(channel);
  } catch (error) {
    res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

async function newChannel(req, res) {
  const channel = req.body;
  const { order_id, buyer, seller } = channel;

  try {
    let channelNew = new Channel({
      order_id,
      buyer: ObjectId(buyer),
      seller: ObjectId(seller)
    });
    result = await channelNew.save();

    return res.status(200).json({
      message: "Succesfully added new channel",
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Ups Hubo un error!",
      error: err,
    });
  }
}

async function pushMsg(req, res) {
  const { id } = req.params;

  try {
    const channel = await Channel.findById(id)
    console.log(channel, "channel");

    let user = JSON.stringify(req.body.user);
    let buyer = JSON.stringify(channel.buyer);
    let seller = JSON.stringify(channel.seller);
    let verifyUser = false;

    if (user == buyer || user == seller) {
      verifyUser = true;
    }

    if (!verifyUser) {
      return res.status(400).json({
        message: "User invalid.",
      });
    }

    let message = {
      date: new Date(),
      user: req.body.user,
      text: req.body.text,
    };

    console.log(message);

    let result = await Channel.findByIdAndUpdate(channel._id, {
      $push: {
        messages: message,
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

module.exports = {
  getChannel,
  getChannelByOrderId,
  newChannel,
  pushMsg,
};
