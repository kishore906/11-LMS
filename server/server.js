import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { clerkWebHooks } from "./controllers/webhooks.js";

// initializing express
const app = express();

// connect to database
await connectDB();

// middleware
app.use(cors());

app.use(function (req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }

  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("api working..");
});
app.post("/clerk", express.json(), clerkWebHooks);

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
