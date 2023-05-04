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
        case "ORDER_COMPLETED_BY_SELLER":
            return {
                title: "Notification",
                subtitle: "Work completed by seller!",
                titleBody: "Work completed by seller",
                body: `Order #${order_id}`
            }
        case "ORDER_PAID":
            return {
                title: "Notification",
                subtitle: "Order Paid!",
                titleBody: "Order Paid",
                body: `Order #${order_id}`
            }
        case "ORDER_DISPUTE_RECEIVER_FEE_PENDING":
            return {
                title: "Notification",
                subtitle: "Order dispute receiver fee pending!",
                titleBody: "Order dispute receiver fee pending",
                body: `Order #${order_id}`
            }
        case "ORDER_REFUNDED":
            return {
                title: "Notification",
                subtitle: "Order Reimbursed!",
                titleBody: "Order Reimbursed",
                body: `Order #${order_id}`
            }
        case "ORDER_DISPUTE_IN_PROGRESS":
            return {
                title: "Notification",
                subtitle: "Dispute initiated",
                titleBody: "Dispute initiated as seller rejected your claim",
                body: `Order #${order_id}`
            }
        case "ORDER_CLOSE_DEAL":
            return {
                title: "Notification",
                subtitle: "Seller has requested your payment!",
                titleBody: "Seller has requested your payment",
                body: `Order #${order_id}`
            }
        case "ORDER_DISPUTE_FINISHED":
            return {
                title: "Notification",
                subtitle: "Order dispute finished!",
                titleBody: "Order dispute finished",
                body: `Order #${order_id}`
            }
        case "ORDER_DISPUTE_APPEALABLE":
            return {
                title: "Notification",
                subtitle: "Order dispute appealable!",
                titleBody: "Order dispute appealable",
                body: `Order #${order_id}`
            }
        default:
            return null
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

            if (!message) {
                console.error(err);
                reject(err)
            }

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