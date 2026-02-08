import mongoose from "mongoose";

const issuedBookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookId: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
  returnDate: { type: Date },
  isreturned: { type: Boolean, default: false },
  fine: { type: Number, default: 0 }
});

const IssuedBook = mongoose.model.IssuedBook || mongoose.model("IssuedBook", issuedBookSchema);
export default IssuedBook;