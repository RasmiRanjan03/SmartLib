import mongoose from "mongoose";

const issuedBookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookId: { type: String, required: true },
  bookTitle: { type: String, required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  isreturned: { type: Boolean, default: false },
  fine: { type: Number, default: 0 }
});

const IssuedBook = mongoose.model.IssuedBook || mongoose.model("IssuedBook", issuedBookSchema);
export default IssuedBook;