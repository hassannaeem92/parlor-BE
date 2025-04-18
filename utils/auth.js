const jwt = require("jsonwebtoken");
const env = require("../global");
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If Authorization header is not present or doesn't start with "Bearer "
    return res.status(401).json({});
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    jwt.verify(token, env.SECRET);
    next();
  } catch (error) {
    return res.status(401).json({});
  }
};
