import express from 'express';
import { studentlogin,checkstudentauth,logout,getstudentdetails } from '../controller/studentcontoller.js';
import studentAuth from '../middleware/studentauth.js';
import multer from 'multer';

const router=express.Router();
router.post('/login',studentlogin)
router.get('/checkauth',checkstudentauth)
router.get('/logout',logout);
router.get('/studentdetails',studentAuth,getstudentdetails)

export default router;