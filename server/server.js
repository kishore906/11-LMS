import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import userRoutes from "./routes/userRoutes.js";
import eductarRoutes from "./routes/educatorRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import { stripeWebhook } from "./controllers/webhooks.js";
//import { clerkWebHooks } from "./controllers/webhooks.js";

dotenv.config();

// initializing express
const app = express();

// connect to database
await connectDB();

// connect to cloudinary
await connectCloudinary();

// // Use middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this frontend origin (React app)
  credentials: true, // Allow cookies to be sent with requests (important for JWT in cookies)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type"], // Allow specific headers
};

app.use(cors(corsOptions)); // Use the CORS middleware

// Routes
//app.post("/clerk", express.json(), clerkWebHooks);
app.use("/api", userRoutes);
app.use("/api/educator", eductarRoutes);
app.use("/api/course", courseRoutes);
app.post(
  "/api/stripe",
  express.raw({ type: "application/json*" }),
  stripeWebhook
);

/*
Meaning of express.raw({ type: "application/json*" }):

1. express.raw() → tells Express to keep the request body as a Buffer (raw bytes).
2. { type: "application/json*" } → applies this only to requests with a Content-Type header matching application/json (or any subtype, since *).

In Short:
express.raw({ type: "application/json*" }) = middleware that tells Express to leave Stripe’s webhook body untouched so the signature check works.
*/

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
