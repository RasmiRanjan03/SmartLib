import {addstudent} from "../controller/admincontroller.js";
import express from 'express';
import upload from '../middleware/multer.js';
const router=express.Router();

router.post('/addstudent',upload.single('image'),addstudent);

export default router;