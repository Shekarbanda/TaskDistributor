const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

/**
 * Agent Schema
 */
const agentSchema = new Schema(
  {
    name:{type:String, required:true},
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String },
  },
  { timestamps: true, versionKey: false }
);


module.exports = mongoose.model("Agent", agentSchema);
