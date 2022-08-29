const amqp = require("amqplib");
const queue = "items";
require("dotenv").config();
require("../db");

async function subscriber() {
    console.log("-- Worker Items Save Started --")
    const connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();
  
    await channel.assertQueue(queue);
  
    channel.consume(queue, async (message) => {
      const content = JSON.parse(message.content.toString());
     
      console.log(content, "content")
      console.log(`Received message from "${queue}" queue`);
  
        setTimeout(() => {
            channel.ack(message);

        }, 8000);
    });
  }
  
  subscriber().catch((error) => {
    console.error(error);
    process.exit(1);
  });