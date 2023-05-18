const { Channel } = require("../models/Channel");
const ObjectId = require("mongoose").Types.ObjectId;
const { uploadFileEvidence } = require("../utils/uploads");
const { Filevidence } = require("../models/Filevidence");
const { Profile } = require("../models/Profile");
const { Notification } = require("../models/Notifications");
const { sendNotiTargeted } = require("../utils/pushProtocolUtil");
const getPagination = require("../libs/getPagination");

async function getChannel(req, res) {
  const { id } = req.params;

  try {
    const channel = await Channel.findById(id);

    return res.status(200).json({
      status: "ok",
      result: channel,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}
async function getMessagesByOrderId(req, res) {
  const { id } = req.params;

  try {
    const channel = await Channel.findOne({
      order_id: id,
    })

    if (!channel) {
      throw new Error("Channel not exist.");
    }

    if (channel.messages.length > 0) {
      return res.status(200).json(true);
    } else {
      return res.status(200).json(false);
    }

  } catch (err) {
    console.error(err)
    return res.status(400).json({
      message: "Ups Hubo un error!"
    });
  }
}

async function getChannelByOrderId(req, res) {
  const { id } = req.params;

  try {
    const channel = await Channel.findOne({
      order_id: id,
    })
      .populate("buyer", "name photo eth_address")
      .populate("seller", "name photo eth_address")
      .populate({
        path: 'order_id',
        model: 'Order',
        select: { itemId: 1, transactionHash: 1, status: 1 }
      });

    if (!channel) {
      throw new Error("Channel not exist.");
    }

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
      message: "Ups Hubo un error!"
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
      user_eth_address: req.body.user_eth_address.toLowerCase(),
      text: req.body.text
    };

    let result = await Channel.findByIdAndUpdate(channel._id, {
      $push: {
        messages: message,
      },
    });

    let userSelected = user == buyer ? seller : buyer;

    // Get User Seller
    const profile = await Profile.findOne({
      _id: JSON.parse(userSelected)
    })

    // Noti seller
    const newNotification = new Notification({
      user_id: profile._id,
      type: "Channel",
      reference: channel.order_id
    });

    await newNotification.save();

    sendNotiTargeted(profile.eth_address.toLowerCase(), "Channel", channel.order_id)

    return res.status(200).json(result);
  } catch (error) {
    console.error(error)
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
        user_eth_address: req.body.user_eth_address.toLowerCase(),
        text: null,
        file: resultNewFilevidence._id
      };

      await Channel.findByIdAndUpdate(channel._id, {
        $push: {
          messages: message,
        },
      });
    }

    let userSelected = user == buyer ? seller : buyer;

    // Get User Seller
    const profile = await Profile.findOne({
      _id: JSON.parse(userSelected)
    })

    // Noti seller
    const newNotification = new Notification({
      user_id: profile._id,
      type: "Channel",
      reference: channel.order_id
    });

    await newNotification.save();

    sendNotiTargeted(profile.eth_address.toLowerCase(), "Channel", channel.order_id)

    return res.status(200).json({
      message: "Ok"
    })

  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

const getChannelsBuyerByProfile = async (req, res) => {
  const { id } = req.params;
  const { size, page } = req.query;
  const { limit, offset } = getPagination(page, size);
  const sort = { updatedAt: -1 };

  try {
    const data = await Channel.paginate({
      buyer: ObjectId(id)
    }, {
      offset, limit, sort, populate: [
        {
          path: 'seller',
          model: 'Profile',
          select: { name: 1, photo: 1, eth_address: 1 }
        },
        {
          path: 'order_id',
          model: 'Order',
          select: { itemId: 1, transactionHash: 1, status: 1 }
        }
      ]
    });

    return res.status(200).json({
      totalItems: data.totalDocs,
      items: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
      prevPage: data.prevPage - 1,
      nextPage: data.nextPage - 1,
    });
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: err,
    });
  }
}

const getChannelsSellerByProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const channels = await Channel.find({
      seller: ObjectId(id)
    })

    return res.status(200).json(channels)
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: err,
    });
  }
}



module.exports = {
  getChannel,
  getChannelByOrderId,
  getMessagesByOrderId,
  newChannel,
  pushMsg,
  pushMsgWithFiles,
  getChannelsBuyerByProfile,
  getChannelsSellerByProfile
};
