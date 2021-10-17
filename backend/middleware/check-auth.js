const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("auth", token);
    jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch (error) {
      res.status(401).json({
        message: 'You are not authenticated!'
      });
  }
}
