import mongoose from "mongoose";

// connecting to the database
const connectDB = () => {
  mongoose.connection.on("connected", () => {
    console.log("Database Connected..");
  });
  mongoose.connect(process.env.MONGODB_URL);
};

export default connectDB;
