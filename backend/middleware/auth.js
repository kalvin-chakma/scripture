const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET || "defaultSecret";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      req.userID = decoded.userID;
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
};

module.exports = {
  authenticateJWT,
  SECRET,
};
