const amqp = require("amqplib");
const { Profile } = require("../models/Profile");
const ObjectId = require("mongoose").Types.ObjectId;

async function useNewNotiRabbit(queue, user, type, reference) {
  return new Promise(async (resolve, reject) => {

    let user_id
    let path
    let message 

    if(!queue || !user || !type || !reference){
      return reject("Missing Data.")
    }

    if (ObjectId.isValid(user)) {
      user_id = user
    }

    if (!ObjectId.isValid(user)) {
      console.log(user, "userrr")
      const result = await Profile.findOne({
        eth_address: user.toUpperCase()
      })
      console.log(result, "result")
      user_id = result._id || null;
    }

    if(!user_id){
      return reject("User not valid.")
    }

    switch (type) {
      case 'Sale':
          path = "profile/orders/as-seller"
          message = "New Sale!"
          break;
      case 'ReleasePayment':
          path = "payment"
          message = "New Payment!"
          break;
      default:
        return reject("Type not valid.")
    }

    let content = {
      user_id,
      type: type,
      path,
      reference,
      message
    }

    // Connect Rabbit
    const connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue);

    const sent = await channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(content)),
      {
        // persistent: true
      }
    );

    console.log(sent)

    if (sent) {
      console.log(`Sent message to "${queue}" queue`);
      return resolve(sent);
    } else {
      console.log(`Fails sending message to "${queue}" queue`);
      return reject("Fails sending message");
    }
  });
}

async function useSeenNotiRabbit(queue, noti_id) {
  return new Promise(async (resolve, reject) => {
    console.log(noti_id)
    if(!queue || !noti_id){
      return reject("Missing Data.")
    }

    if (!ObjectId.isValid(noti_id)) {
      reject("Noti Id not valid.")
    }

    let content = {
      noti_id
    }

    // Connect Rabbit
    const connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue);

    const sent = await channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(content)),
      {
        // persistent: true
      }
    );

    console.log(sent)

    if (sent) {
      console.log(`Sent message to "${queue}" queue`);
      return resolve(sent);
    } else {
      console.log(`Fails sending message to "${queue}" queue`);
      return reject("Fails sending message");
    }
  });
}

module.exports = {
  useNewNotiRabbit,
  useSeenNotiRabbit
};
