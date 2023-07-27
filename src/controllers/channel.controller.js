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

async function getChannelById(req, res) {
  const { id } = req.params;

  try {
    const channel = await Channel.findById(id)
      .populate("buyer", "name photo eth_address")
      .populate({
        path: 'seller',
        model: 'Profile'
      })
      .populate({
        path: 'order_id',
        model: 'Order',
        select: { itemId: 1, transactionHash: 1, status: 1 }
      })
      .populate({
        path: 'item_id',
        model: 'Item'
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
  const { buyer, seller, order_id, item_id } = channel;

  try {
    if (!buyer || !seller || !item_id) {
      throw "Buyer or Seller or ItemId is missing."
    }

    if (order_id) {
      const verifyChannelExist = await Channel.findOne({
        buyer: ObjectId(buyer),
        seller: ObjectId(seller),
        item_id: ObjectId(item_id),
        order_id: null
      });

      if (verifyChannelExist) {
        // Actualizar channel con order_id
        const updateChannel = await Channel.findByIdAndUpdate(verifyChannelExist._id, {
          order_id: order_id
        })
        return res.status(200).json({
          message: "Succesfully updated channel",
          result: updateChannel._id,
        });
      }

      // Si no que cree un nuevo channel con orderid
      const newChannel = new Channel({
        buyer: ObjectId(buyer),
        seller: ObjectId(seller),
        item_id,
        order_id
      });

      const result = await newChannel.save();

      return res.status(200).json({
        message: "Succesfully added new channel",
        result: result,
      });
    }

    // Si no, existe el order_id crear un channel sin order.
    const newChannel = new Channel({
      buyer: ObjectId(buyer),
      seller: ObjectId(seller),
      item_id
    });
    const result = await newChannel.save();

    return res.status(200).json({
      message: "Succesfully added new channel",
      result: result,
    });
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: err.message ? err.message : "Error"
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
      reference: channel._id
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
      reference: channel._id
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
  const { size, page } = req.query;
  const { limit, offset } = getPagination(page, size);
  const sort = { updatedAt: -1 };

  try {
    const data = await Channel.paginate({
      seller: ObjectId(id)
    }, {
      offset, limit, sort, populate: [
        {
          path: 'buyer',
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

const findChannel = async (req, res) => {
  const { order_id, buyer, seller, item_id } = req.body;
  try {

    if (order_id) {
      const result = await Channel.findOne({
        order_id: order_id
      })

      return res.status(200).json({
        id: result._id
      });
    }

    if (buyer, seller, item_id) {
      const result = await Channel.findOne({
        buyer: ObjectId(buyer),
        seller: ObjectId(seller),
        item_id: ObjectId(item_id),
        order_id: null
      });

      if (!result) {
        return res.status(200).json({
          id: null
        });
      }

      return res.status(200).json({
        id: result._id
      });
    }

    throw "Buyer seller or itemId is missing";

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }

}

const updateSettings = async (req, res) => {
  const { id } = req.params;
  const { priceconfig, time_for_service, time_for_claim } = req.body;

  try {
    const result = await Channel.findByIdAndUpdate(id, {
      priceconfig: priceconfig,
      time_for_service,
      time_for_claim
    });

    return res.status(200).json(result)

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await Channel.findByIdAndUpdate(id, {
      status: status
    })

    return res.status(200).json(result)
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}


module.exports = {
  getChannel,
  getChannelById,
  getMessagesByOrderId,
  newChannel,
  pushMsg,
  pushMsgWithFiles,
  getChannelsBuyerByProfile,
  getChannelsSellerByProfile,
  findChannel,
  updateSettings,
  updateStatus
};
