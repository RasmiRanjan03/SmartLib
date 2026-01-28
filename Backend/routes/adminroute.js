import {addstudent,addbook} from "../controller/admincontroller.js";
import express from 'express';
import upload from '../middleware/multer.js';
const router=express.Router();

router.post('/addstudent',upload.single('image'),addstudent);
router.post('/addbook',upload.single('coverImage'),addbook);

export default router;