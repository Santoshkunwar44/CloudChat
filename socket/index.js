const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

// ADDING THE USER'S USERID AND THE SOCKETID IN THE ONLINEUSER ARRAY EVERY TIME ONE (--NEW--) CLIENT JOINS

const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId !== userId) &&
    onlineUsers.push({ userId, socketId });
};

// REMOVING THE USER'S USERID AND SOCKETID FROM THE ONLINEUSERS ARRAY WHEN THE USER DISCONNECTED FROM THE BROWSER

const removeUser = (socketId) => {
  onlineUsers.filter((user) => user.socketId !== socketId);
};

//get user functions to send the message

const getuser = (receiverId) => {
  const receiver = onlineUsers.find((user) => user.userId === receiverId);
  return receiver;
};

io.on("connection", (socket) => {
  console.log("Someone connected");
});
