const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "medical-records";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.userType }, secretKey, { expiresIn: "1h" });
};

module.exports = generateToken;
