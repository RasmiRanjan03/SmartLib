import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodbconnection.js';
import cookieParser from 'cookie-parser';
import admin from './routes/adminroute.js';
import student from './routes/studentroute.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
connectCloudinary();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedcors=[
    'http://localhost:8080',
    'http://localhost:4000',
    'http://localhost:8081',
    'http://localhost:5173',
    'http://localhost:3000',
    "https://smartlib-1.onrender.com"
]
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedcors.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(cookieParser());
app.use('/api/admin',admin)
app.use('/api/student',student)
app.get('/', (req, res) => {
  res.send('Welcome to SmartLib Backend Rasmi!');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Global Error Handler for debugging
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});