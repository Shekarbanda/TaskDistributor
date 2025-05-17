const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

/**
 * User Schema
 */
const userSchema = new Schema(
  {
    email: { type: String, sparse: true },
    password: { type: String },
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error while comparing passwords");
  }
};

module.exports = mongoose.model("User", userSchema);
