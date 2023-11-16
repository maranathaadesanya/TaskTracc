const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');
require('dotenv').config();

const authenticateUser = async (req, res, next) => {
  try {
    // Extract the token from the request headers, cookies, or wherever it's stored
    const token = req.headers.authorization || req.cookies.token || '';

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    // Verify the token using the secret key
    jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      // Check if the decoded token has the user's ID
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
      }

      // Set the user on the request object for use in subsequent middleware/routes
      req.user = user;
      next(); // Call next middleware or router handler
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = authenticateUser;