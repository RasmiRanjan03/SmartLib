import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodbconnection.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
connectCloudinary();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
  res.send('Welcome to SmartLib Backend Rasmi!');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});