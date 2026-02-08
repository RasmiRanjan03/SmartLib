import express from 'express';
import { studentlogin,checkstudentauth,logout,getstudentdetails,getallbooks,issuebook,getcurrentlyissuedbooks } from '../controller/studentcontoller.js';
import studentAuth from '../middleware/studentauth.js';
import multer from 'multer';

const router=express.Router();
router.post('/login',studentlogin)
router.get('/checkauth',checkstudentauth)
router.get('/logout',logout);
router.get('/studentdetails',studentAuth,getstudentdetails)
router.get('/allbooks',getallbooks)
router.post('/issuebook/:bookId',studentAuth,issuebook)
router.get('/currentlyissuedbooks',studentAuth,getcurrentlyissuedbooks)
export default router;