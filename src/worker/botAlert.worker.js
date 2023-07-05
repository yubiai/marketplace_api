const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TOKENBOT_TELEGRAM);

const titleAlert = (title) => {

    switch (title) {
        case "newItem":
            return "New Post"
        case "updateItem":
            return "Update Post" 
        case "newVerify":
            return "New verification User"     
        default:
            return "No Data"    
    }
}

const sendMsgBot = (title, id) => {
    let html = `<b>${titleAlert(title)}:</b> ID ${id}`;

    bot.telegram.sendMessage(process.env.CHATG_TELEGRAM, '<b>Yubiai Marketplace:</b>\n' + html, { parse_mode: 'HTML' });
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
        ctx.reply("Que pasa conmigo? Gato")
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