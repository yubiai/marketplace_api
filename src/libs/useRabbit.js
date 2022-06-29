const amqp = require("amqplib");

async function useRabbit(queue, message) {
  return new Promise(async (resolve, reject) => {
    const connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue);

    const sent = await channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      {
        // persistent: true
      }
    );

    console.log(sent)

    if (sent) {
      console.log(`Sent message to "${queue}" queue`, message);
      return resolve(sent);
    } else {
      console.log(`Fails sending message to "${queue}" queue`, message);
      return reject("Fails sending message");
    }
  });
}

module.exports = useRabbit;
