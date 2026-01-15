import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // 1. Get header (Express automatically handles lowercase 'authorization')
  const authHeader = req.headers.authorization;

  // 2. Check if header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // 3. Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // 4. Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Attach user data (id, role) to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

