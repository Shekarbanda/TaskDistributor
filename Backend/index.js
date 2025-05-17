const connectDatabase = require("./config/db.js");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");

const { authMiddleware } = require("./middleware/authMiddleware.js");

connectDatabase();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://taskdistributor.onrender.com",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/user", authMiddleware, userRoute);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started at Port ${port}`);
});
