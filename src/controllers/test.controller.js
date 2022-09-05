//
const { Storage } = require("@google-cloud/storage");
const { upload_gc } = require("../utils/uploads");

async function asd(req, res) {

    const result = await upload_gc("./src/public/uploads/asd.jpg")

    console.log(result, "Finale")

    return res.json("asd")
}

module.exports = {
    asd
};
