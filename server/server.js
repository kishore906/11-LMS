import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { clerkWebHooks } from "./controllers/webhooks.js";

// initializing express
const app = express();

// middleware
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("api working..");
});
app.post("/clerk", express.json(), clerkWebHooks);

// port
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database Connected");
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
