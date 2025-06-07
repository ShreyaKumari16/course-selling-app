const jwt = require("jsonwebtoken");
const { ADMIN_JWT_SECRET } = require("../config");

function adminMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith("Bearer ")) ? authHeader.slice(7) : req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
}

module.exports = {
  adminMiddleware,
};