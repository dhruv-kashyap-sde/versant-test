const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
   try {
     const token = req.body.token;
     if (!token) return res.status(401).json({ message: "Unauthorized" });
   
     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
       if (err) return res.status(403).json({ message: "Invalid Token" });
       console.log(decoded);
       req.user = decoded;
       next();
     });
   } catch (error) {
    res.status(401).json({error: error.message});
   }
};

module.exports = { verifyToken };