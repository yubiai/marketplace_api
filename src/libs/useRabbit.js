const amqp = require("amqplib");

async function useRabbit(queue, message) {
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

  sent
    ? console.log(`Sent message to "${queue}" queue`, message)
    : console.log(`Fails sending message to "${queue}" queue`, message);
}

module.exports = useRabbit;