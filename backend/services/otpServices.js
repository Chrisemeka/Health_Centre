const crypto = require("crypto");
const NodeCache = require("node-cache");

const otpCache = new NodeCache({ stdTTL: 300 }); // OTP expires in 5 minutes

/**
 * Generate a random 4-digit OTP
 */
exports.generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Store OTP in temporary cache (expires in 5 minutes)
 */
exports.storeOTP = (email, otp) => {
  otpCache.set(email, otp);
};

/**
 * Verify OTP entered by the doctor
 */
exports.verifyOTP = (email, enteredOTP) => {
  const storedOTP = otpCache.get(email);
  if (storedOTP && storedOTP === enteredOTP) {
    otpCache.del(email); // Remove OTP after successful verification
    return true;
  }
  return false;
};
