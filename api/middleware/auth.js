const jwt = require('jsonwebtoken');

// JWT Secret (should match the one used in the login route)
const jwtSecret = 'your_jwt_secret';

module.exports = function (req, res, next) {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;  // Store the decoded payload in req.user
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
