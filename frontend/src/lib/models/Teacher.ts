import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // Crucial for registration check
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
