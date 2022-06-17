if (process.env.NODE_ENV === "PROD"){
  require('newrelic');
}
require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require('passport')
const fs = require("fs");
const https = require("https");
require('./utils/passport')(passport)
const config = require("./db");

/* const ethers = require("ethers");
const PaymentProcessor = require("./../../frontend/src/artifacts/contracts/PaymentProcessor.sol/PaymentProcessor.json");
const { Payment } = require("./models/Payment"); */

const app = express();
const category = require("./routes/category/category");
const subcategory = require("./routes/subcategory/subcategory");
const item = require("./routes/item/item");
const profile = require("./routes/profile/profile");
const pricecoin = require("./routes/pricecoin/pricecoin");
const order = require("./routes/order/order");
const channel = require("./routes/channel/channel");
const publish = require("./routes/publish/publish");
const auth = require("./routes/auth/auth");
/* const user = require("./routes/user/user");
const shipping = require("./routes/shipping/shipping");
const question = require("./routes/question/question");
const cart = require("./routes/cart/cart");
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
app.use(passport.initialize())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use("/api/auth", auth);
app.use("/api/items", item);  // security
app.use("/api/categories", category)
app.use("/api/subcategories", subcategory)
app.use("/api/prices", pricecoin);  // security
app.use("/api/orders", order);  // security
app.use("/api/profiles", passport.authenticate('jwt', {session: false}), profile);
app.use("/api/channel", passport.authenticate('jwt', {session: false}), channel);
app.use("/api/publish", passport.authenticate('jwt', {session: false}), publish);
//app.use("/api/user", user);
//app.use("/api/items", passport.authenticate('jwt', {session: false}), item);
//app.use("/api/questions", question);
//app.use("/api/carts", cart);
//app.use("/api/shipping", shipping);

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