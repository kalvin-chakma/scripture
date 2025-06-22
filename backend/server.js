const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const connectToDB = require("./db/db");
const userRouter = require("./routes/user");
const noteRouter = require("./routes/notes");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

require("./middleware/OAuth");
app.use(passport.initialize());

app.use("/user", userRouter);
app.use("/note", noteRouter);

connectToDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
