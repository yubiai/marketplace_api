const ethers = require('ethers');
const PushAPI = require('@pushprotocol/restapi')

const PK = process.env.PRIVATE_WALLET_KEY;


const formatMsg = (type, order_id) => {
    console.log(type)
    switch (type) {
        case "Channel":
            const message = {
                title: "Notification",
                subtitle: "New Message!",
                titleBody: "New Message",
                body: `Order #${order_id}`
            }
            return message
        case "NewQuestion":
            return {
                title: "Notification",
                subtitle: "New Question!",
                titleBody: "New Question",
                body: `Item #${order_id}`
            }
        case "Sale":
            return {
                title: "Notification",
                subtitle: "New Sale!",
                titleBody: "New Sale",
                body: `Order #${order_id}`
            }
        case "Orderchange":
            return {
                title: "Notification",
                subtitle: "New status change in order!",
                titleBody: "New status change in order",
                body: `Order #${order_id}`
            }
        default:
            break;
    }

}


// Send notification to only one subscriber
function sendNotiTargeted(walletUser, type, order_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const Pkey = `0x${PK}`;
            const signer = new ethers.Wallet(Pkey);

            const message = formatMsg(type, order_id)
            console.log(message, "message")
            await PushAPI.payloads.sendNotification({
                signer: signer,
                type: 3, // target
                identityType: 2, // direct payload
                notification: {
                    title: message.title,
                    body: message.subtitle
                },
                payload: {
                    title: message.titleBody,
                    body: message.body,
                    cta: '',
                    img: ''
                },
                recipients: walletUser, // recipients addresses
                channel: process.env.CHANNEL_PUSH_ADDRESS, // your channel address
                env: 'prod'
            });

            return resolve(true);
        } catch (err) {
            console.error(err);
            reject(err)
        }
    })
}



module.exports = {
    sendNotiTargeted
};