const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const mongodb_url = process.env.NODE_ENV === "PROD" ? process.env.MONGODB_URL_PREPRO : process.env.MONGODB_URL_TEST

if (!mongodb_url) {
  console.log(
    "Setee la variable de entorno MONGODB_URL_XXXX",
    mongodb_url
  );
  process.exit(1);
}

mongoose
  .connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
  })
  .then(function () {
    console.log("Conectado a la Base de Datos con éxito!");
    console.log(mongodb_url)
  })
  .catch(function (err) {
    console.log("Ups! Hubo un error al conectar con la base de datos!");
    console.log(err.message);
  });

module.exports = mongoose.connection;
