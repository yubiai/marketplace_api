const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TOKENBOT_TELEGRAM);
const chatGroupItem = process.env.CHATG_TELEGRAM;
const chatGroupUser = process.env.CHATG_TELEGRAM_USER;

const typeAlert = (title) => {

    switch (title) {
        case "newItem":
            return {
                msg: "New Post",
                group: chatGroupItem
            }
        case "updateItem":
            return {
                msg: "Update Post",
                group: chatGroupItem
            }  
        case "newVerify":
            return {
                msg: "New verification User",
                group: chatGroupUser
            } 
        case "newUser":
            return {
                msg: "New User",
                group: chatGroupUser
            }               
        default:
            return "No Data"    
    }
}

const sendMsgBot = (title, id) => {

    const alert = typeAlert(title);

    let html = `<b>${alert.msg}:</b> ID ${id}`;

    bot.telegram.sendMessage(alert.group, '<b>Yubiai Marketplace:</b>\n' + html, { parse_mode: 'HTML' });
    return
}

const botAlertWorker = () => {
    bot.help((ctx) => {
        let html = `Command reference:
        /help - Show this help page
        `
        ctx.reply(html)
    })

    bot.hears('bot', (ctx) => {
        ctx.reply("Que pasa?")
    })

    bot.on('text', (ctx) => {
        // Explicit usage
        bot.telegram.sendMessage(process.env.CHATG_TELEGRAM, "BOT YB ON, HELLO");
    })

    bot.launch();
}


module.exports = {
    botAlertWorker,
    sendMsgBot
};