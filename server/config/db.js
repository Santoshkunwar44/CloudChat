const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected ", connection.connection.host);
  } catch (err) {
    console.log("error ", err.message);
    process.exit();
  }
};

module.exports = connectDb;
