const mongoose = require("mongoose")

const connectDb = async () => {
  try {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log("Connected to MongoDB");
} catch (error) {
  console.error(error.message);
 return res.status(503).json("Error while connecting db")
}
}

module.exports = connectDb