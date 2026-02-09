import {addstudent,addbook,loginadmin} from "../controller/admincontroller.js";
import adminAuth from "../middleware/adminauth.js";
import express from 'express';
import upload from '../middleware/multer.js';
const router=express.Router();

router.post('/addstudent',upload.single('image'),adminAuth,addstudent);
router.post('/addbook',upload.single('coverImage'),adminAuth,addbook);
router.post('/adminlogin',loginadmin);

export default router;