require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require('passport')
const fs = require("fs");
const https = require("https");
require('./utils/passport')(passport)

/* const ethers = require("ethers");
const PaymentProcessor = require("./../../frontend/src/artifacts/contracts/PaymentProcessor.sol/PaymentProcessor.json");
const { Payment } = require("./models/Payment"); */

const app = express();
const category = require("./routes/category/category");
const item = require("./routes/item/item");
const profile = require("./routes/profile/profile");
const question = require("./routes/question/question");
const cart = require("./routes/cart/cart");
const shipping = require("./routes/shipping/shipping");
const message = require("./routes/message/message");
const pricecoin = require("./routes/pricecoin/pricecoin");

const config = require("./db");
const LoadCategories = require('./scripts/loadCategories');
const { refreshPriceCoin } = require('./worker/regreshPriceCoin');

app.use(cors('*'));
app.use(passport.initialize())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api/categories", category)
//app.use("/api/items", passport.authenticate('jwt', {session: false}), item);
app.use("/api/items", item);
app.use("/api/profiles", profile);
app.use("/api/questions", question);
app.use("/api/carts", cart);
app.use("/api/shipping", shipping);
app.use("/api/messages", message);
app.use("/api/prices", pricecoin);

if (process.env.NODE_ENV === "DEV"){
  app.listen(process.env.PORT || 4000, () => {
    console.log("Server running on port", process.env.PORT);
  });
} else {
  const sslServer = https.createServer(
    {
      key: fs.readFileSync("./certs/privkey.pem"),
      cert: fs.readFileSync("./certs/fullchain.pem"),
    },
    app
  );
  
  sslServer.listen(process.env.PORT || 4000, () => {
    console.log("Server running on port", process.env.PORT || 4000);
  });
  
}

//refreshPriceCoin();

// Load Categories
//LoadCategories()

/* const listenToEvents = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545"
  );
  
  const ppAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const paymentProcessor = new ethers.Contract(
    ppAddress,
    PaymentProcessor.abi,
    provider
  );

  paymentProcessor.on("PaymentDone", async (payer, amount, paymentId, date) => {
    console.log(`
          from ${payer}
          amount ${amount}
          paymentId ${paymentId}
          date ${new Date(date.toNumber() * 1000).toLocaleString()}
        `);
    const payment = await Payment.findOne({ id: paymentId });
    if (payment) {
      payment.paid = true;
      await payment.save();
    }
  });
};

listenToEvents();
 */