const amqp = require("amqplib");
const { Notification } = require("../models/Notifications");
const queue = "notifications";
require("dotenv").config();
require("../db");

function intensiveOperation() {
  let i = 1e3;
  while (i--) {}
}

function saveNotification(content) {
  return new Promise(async (resolve, reject) => {
    try {
      const newNotification = new Notification(content);
      const result = await newNotification.save();

      return resolve(result);
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
}

async function subscriber() {
  console.log("-- Worker Notifications Started --")
  const connection = await amqp.connect(process.env.AMQP_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue);

  channel.consume(queue, async (message) => {
    const content = JSON.parse(message.content.toString());

    intensiveOperation();

    console.log(`Received message from "${queue}" queue`);
    console.log(content);
    await saveNotification(content);
    channel.ack(message);
  });
}

subscriber().catch((error) => {
  console.error(error);
  process.exit(1);
});
