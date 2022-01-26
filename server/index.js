const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// const importing the required routes
const authRoute = require("./routes/auth");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");

dotenv.config();
//MongoDb connection
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("connected to MongoDB");
});
//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("common"));

//setting the routes

app.use("/api/auth", authRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);

app.listen(3000, () => console.log("Server started"));
