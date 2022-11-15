const { MsgFeedback } = require("../models/MsgFeedback");

async function newMessageFeedback(req, res) {

    const { title, email, message } = req.body;

    try {
        let newMessage = new MsgFeedback({
            title, email, message
        });
        const result = await newMessage.save();

        return res.status(200).json({
            message: "Succesfully added new message feedback.",
            result: result,
        });

    } catch (err) {

        return res.status(400).json({
            message: "Ups Hubo un error!",
            error: err,
        });
    }
}


module.exports = {
    newMessageFeedback
};
