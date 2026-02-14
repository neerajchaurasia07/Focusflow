import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  duration: { type: Number, required: true }, // minutes
  // optional: mode (work/shortBreak/longBreak)
  mode: { type: String, default: "work" }
}, { timestamps: true });

const Session = mongoose.model("Session", sessionSchema);
export default Session;
