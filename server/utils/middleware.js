// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_super_secret_key";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Expecting: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Missing token" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });

    req.user = user;
    next();
  });
};
