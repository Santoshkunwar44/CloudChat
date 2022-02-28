const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const morgan = require("morgan");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");
const userRoute = require("./routes/user.js");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/message");
const notificationRoute = require("./routes/notification");
const passportAuth = require("./routes/passportAuth");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./config/strategies");

let io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
dotenv.config();
connectDb();

// initializing the middlewares
app.use(
  cookieSession({
    name: "session",
    keys: ["santosh"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json()); // parses the json received from the frontEnd
app.use(morgan("common"));

// END POINTS
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/notification", notificationRoute);
app.use("/auth", passportAuth);
//middlewares

app.use(notFound);
app.use(errorHandler);

io.on("connection", (socket) => {
  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connection");
  });

  socket.on("join Chat", (room) => {
    socket.join(room);
    console.log("new room", room);
  });

  socket.on("new Message", (data) => {
    console.log("recieved", data);
    let chat = data.chat;

    if (!chat.users) return console.log("chat.user is notdefined");

    chat.users.forEach((user) => {
      if (user._id === data.sender._id) return;
      console.log("he is the user ", user);
      socket.in(user._id).emit("message received", data);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing", room);
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
});

//starting the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log("server started at ", PORT));
