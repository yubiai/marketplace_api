const { Channel } = require("../models/Channel");
const ObjectId = require("mongoose").Types.ObjectId;
const { useNewNotiRabbit } = require("../libs/useRabbit");
const { uploadFileEvidence } = require("../utils/uploads");
const { Filevidence } = require("../models/Filevidence");

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
      order_id: id,
    })
      .populate("buyer", "first_name last_name photo eth_address")
      .populate("seller", "first_name last_name photo eth_address")
      .populate({
        path: 'order_id',
        model: 'Order',
        select: { itemId: 1, transactionHash: 1, status: 1 }
      });


    if (channel.messages && channel.messages.length > 0) {
      let messages = [];

      await Promise.all(
        channel.messages.map(async (message, i) => {
          if (message.file && ObjectId.isValid(message.file)) {
            const filevidenceVerify = await Filevidence.findById(message.file);
            if (!filevidenceVerify) {
              return
            }
            message.file = filevidenceVerify
            messages.push(message)
            return
          } else {
            messages.push(message)
            return
          }
        })
      )

      const sortedMessages = messages.sort(
        (objA, objB) => Number(objA.date) - Number(objB.date),
      );

      channel.messages = sortedMessages;
    }

    return res.status(200).json(channel);
  } catch (error) {
    console.error(error)
    return res.status(400).json({
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
      seller: ObjectId(seller),
    });
    result = await channelNew.save();

    return res.status(200).json({
      message: "Succesfully added new channel",
      result: result,
    });
  } catch (err) {

    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: err,
    });
  }
}

async function pushMsg(req, res) {
  const { id } = req.params;

  try {
    const channel = await Channel.findById(id);

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
      text: req.body.text
    };

    let result = await Channel.findByIdAndUpdate(channel._id, {
      $push: {
        messages: message,
      },
    });

    // Noti
    await useNewNotiRabbit(
      "notifications",
      user == buyer ? channel.seller : channel.buyer,
      "Channel",
      channel.order_id
    ).catch((err) => {
        console.log(err);
        return;
      });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

async function pushMsgWithFiles(req, res) {
  const { id } = req.params;
  let filesUpload = req.files;

  try {
    const channel = await Channel.findById(id);

    let user = JSON.stringify(req.body.user);
    let buyer = JSON.stringify(channel.buyer);
    let seller = JSON.stringify(channel.seller);
    let verifyUser = false;

    if (user == buyer || user == seller) {
      verifyUser = true;
    }

    if (!verifyUser) {
      console.error("User invalid.")
      throw new Error("User invalid.");
    }

    for (const file of filesUpload) {
      const result = await uploadFileEvidence(file);

      const newFilevidence = new Filevidence({
        filename: result,
        mimetype: file.mimetype,
        author: req.body.user,
        order_id: channel.order_id
      })

      const resultNewFilevidence = await newFilevidence.save();

      const message = {
        date: new Date(),
        user: req.body.user,
        text: null,
        file: resultNewFilevidence._id
      };

      await Channel.findByIdAndUpdate(channel._id, {
        $push: {
          messages: message,
        },
      });
    }

    // Noti
    await useNewNotiRabbit(
      "notifications",
      user == buyer ? channel.seller : channel.buyer,
      "Channel",
      channel.order_id
    ).catch((err) => {
        console.error(err);
        return;
      });

    return res.status(200).json({
      message: "Ok"
    })

  } catch (error) {
    return res.status(400).json({
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
  pushMsgWithFiles
};
