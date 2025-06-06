const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDB = require("./db/db");
const userRouter = require("./routes/user");
const noteRouter = require("./routes/notes");
const session = require("express-session");
const passport = require("./middleware/googleAuth");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRouter);
app.use("/note", noteRouter);

connectToDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
