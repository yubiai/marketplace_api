const amqp = require("amqplib");
const fs = require("fs");
const { upload_Fleek } = require("../utils/uploads");
const queue = "images.upload";
require("dotenv").config();
require("../db");

async function subscriber() {
    console.log("-- Worker Images Upload Save Started --")
    const connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();
  
    await channel.assertQueue(queue);
  
    channel.consume(queue, async (message) => {
      const file = JSON.parse(message.content.toString());
     
      console.log(file, "file")
      console.log(`Received message from "${queue}" queue`);

      const result = await upload_Fleek(file)

      if(!result){
        console.error("No upload")
      }

      fs.unlinkSync("./upload/" + file.filename);
      console.log(`File old removed`)  
      channel.ack(message);
    });
  }
  
  subscriber().catch((error) => {
    console.error(error);
    process.exit(1);
  });