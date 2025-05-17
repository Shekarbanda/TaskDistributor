const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Task Schema
 */
const taskSchema = new Schema(
  {
    firstName: { type: String, required: true },
    phone: { type: String },
    notes: { type: String },
    agentId: { type: Schema.Types.ObjectId, ref: "Agent" },
  },
  { timestamps: true, versionKey: false }
);


module.exports = mongoose.model("Task", taskSchema);
