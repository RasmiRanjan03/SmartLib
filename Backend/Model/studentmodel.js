import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  course: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  profilepicurl: {type: String, required: true},
  joinedDate: {
    type: Date,
    default: Date.now,
  },
});

const Student = mongoose.model.Student || mongoose.model("Student", studentSchema);
export default Student; 