var jwt = require('jsonwebtoken');
var { JWT_SECRET } = require('../config');

function authenticate(req, res, next) {
  var token = req.cookies.token;

  if (!token) {
    return res.render('error', {
      message: 'Access denied. Please log in first.',
      error: { status: 401 }
    });
  }

  try {
    var decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (err) {
    return res.render('error', {
      message: 'Invalid or expired session. Please log in again.',
      error: { status: 403 }
    });
  }
}

module.exports = authenticate;