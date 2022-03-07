const express = require("express");

const cors = require("cors");

require("dotenv").config();

const app = express();
const path = require('path')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

// test helmet
const helmet = require("helmet");
app.use(helmet.frameguard())

// test rate limit etc
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 0.1 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// test user routes
const userRoutes = require("./routes/user");

// prise en charge du JSON
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended : true }));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
require("./routes/tutorial.routes.js")(app);
app.listen(PORT, () => {
  console.log(` Le serveur est en écoute sur le port ${PORT}.`);
});




const db = require("./models");

const controller = require("./controllers/tutorial.controller");



db.sequelize.sync();
//  db.sequelize.sync({ force: true }).then(() => {
//  console.log("Drop and re-sync db.");
// //  run();
//  });
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use("/api/auth", userRoutes);
