import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author:{type:String, required:true},
  genre:{type:String, required:true},
  summary:{type:String, required:true},
  coverImageUrl:{type:String, required:true},
  rating:{type:Number, default:0},
  reviewcount:{type:Number, default:0},
  totalcopies:{type:Number, required:true},
  availablecopies:{type:Number, required:true},
  keywords:{type:[String], default:[]},
  addedDate:{type:Date, default:Date.now},
},{minimize:false});
const Book = mongoose.model.Book || mongoose.model("Book", bookSchema);
export default Book;