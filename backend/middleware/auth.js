const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied, no token provided' });
    }

    const token = authHeader.split(' ')[1];  // Correctly extracting token
    console.log(token);

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "medical-records"); // Ensure the correct secret key
        console.log(verified);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token', error: error.message });
    }
};

module.exports = { authenticateUser };
