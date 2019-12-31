require("./src/models/User");
require("./src/models/Track");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const trackRoutes = require("./src/routes/trackRoutes");

const requireAuth = require("./src/middlewares/requireAuth");

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => console.log("MongoDb connected"));
mongoose.connection.on("error", err =>
  console.log("Error connecting to mongoDb", err)
);

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));
