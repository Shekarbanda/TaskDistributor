const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/responseUtils");

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json(errorResponse("Authorization token is required"));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json(errorResponse('Token must be prefixed with "Bearer"'));
  }
  if (!token || token.split(".").length !== 3) {
    return res.status(403).json(errorResponse("Malformed token"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).json(errorResponse("Invalid or expired token"));
    }
    req.user = decoded;
    next();
  });
};
