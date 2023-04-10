if (process.env.NODE_ENV === "PROD") {
  require('newrelic');
}
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require('passport');
require('./utils/passport')(passport);
require("./db");

/* const ethers = require("ethers");
const PaymentProcessor = require("./../../frontend/src/artifacts/contracts/PaymentProcessor.sol/PaymentProcessor.json");
const { Payment } = require("./models/Payment"); */

const app = express();
const category = require("./routes/category/category");
const subcategory = require("./routes/subcategory/subcategory");
const deal = require("./routes/deal/deal");
const item = require("./routes/item/item");
const profile = require("./routes/profile/profile");
const pricecoin = require("./routes/pricecoin/pricecoin");
const order = require("./routes/order/order");
const channel = require("./routes/channel/channel");
const evidence = require("./routes/evidence/evidence");
const publish = require("./routes/publish/publish");
const notification = require("./routes/notification/notification");
const auth = require("./routes/auth/auth");
const terms = require("./routes/terms/terms");
const disputespolicy = require("./routes/disputespolicy/disputespolicy");
const question = require("./routes/question/question");
const report = require("./routes/report/report");
const { botAlertWorker } = require('./worker/botAlert.worker');
const { refreshOrdersCron } = require('./worker/refreshOrders');

/* const user = require("./routes/user/user");
const cart = require("./routes/cart/cart");
const msgfeedback = require("./routes/msgfeedback/msgfeedback");
const test = require("./routes/test/test");
 */

// Options Cors
const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(",") : [];
 const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
} 

// Middlewares
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(express.json({ limit: "31mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "31mb", extended: true, parameterLimit: 50000 }))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/ping', function (req, res) {
  console.log("Pong")
  return res.json("pong")
});

//Routes
//app.use("/api/test", test);
app.use("/api/auth", auth);
app.use("/api/items", item);
app.use("/api/categories", category);
app.use("/api/subcategories", subcategory);
app.use("/api/deal", deal);
app.use("/api/terms", terms);
app.use("/api/prices", passport.authenticate('jwt', { session: false }), pricecoin);
app.use("/api/orders", passport.authenticate('jwt', { session: false }), order);
app.use("/api/profiles", passport.authenticate('jwt', { session: false }), profile);
app.use("/api/noti", passport.authenticate('jwt', { session: false }), notification);
app.use("/api/channel", passport.authenticate('jwt', { session: false }), channel);
app.use("/api/publish", passport.authenticate('jwt', { session: false }), publish);
app.use("/api/questions", passport.authenticate('jwt', { session: false }), question);
app.use("/api/report", passport.authenticate('jwt', { session: false }), report);
app.use("/api/evidences", passport.authenticate('jwt', { session: false }), evidence);
app.use("/api/disputespolicy", passport.authenticate('jwt', { session: false }), disputespolicy);

// Bot Telegram
if (process.env.NODE_ENV === "PROD") {
  botAlertWorker();
}

// Refresh Order CRON
refreshOrdersCron();

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running on port", process.env.PORT);
});