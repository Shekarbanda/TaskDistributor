const { loginUserService } = require("../services/authService");
const { errorResponse, successResponse } = require("../utils/responseUtils");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await loginUserService({ email, password });
    res.status(200).json(successResponse(result, "Login successful"));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(error.message || "Internal server error"));
  }
};
