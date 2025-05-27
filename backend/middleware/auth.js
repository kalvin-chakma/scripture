const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user_id = user.userID; 
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { authenticateJWT, SECRET };
