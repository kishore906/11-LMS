import mongoose from "mongoose";

// connecting to the database
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Database Connected..");
  });
  await mongoose.connect(`${process.env.MONGODB_URL}/lms-mern-app`);
};

export default connectDB;
