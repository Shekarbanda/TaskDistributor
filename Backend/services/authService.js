const User = require("../models/userModel");
const { generateJwtToken } = require("../utils/jwtUtils");

exports.loginUserService = async ({ email, password }) => {
  let user = await User.findOne({ email });

  if (!user) {
    throw new Error("User Not Found with this email", 401);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error(
      "Sorry, looks like that’s the wrong email or password.",
      401
    );
  }

  const token = generateJwtToken(user);

  return { user, token };
};
