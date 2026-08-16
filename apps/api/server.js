const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const prisma = require("@scripture/db");
const userRouter = require("./routes/user");
const noteRouter = require("./routes/notes");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: (process.env.CORS_ORIGINS || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());

require("./middleware/OAuth");
app.use(passport.initialize());

app.use("/user", userRouter);
app.use("/note", noteRouter);

prisma
  .$connect()
  .then(() => {
    console.log(" Database connected");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error(" Database connection failed:", error);
    process.exit(1);
  });
