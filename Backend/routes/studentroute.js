import express from 'express';
import { studentlogin,checkstudentauth,logout,getstudentdetails,getallbooks,issuebook,getcurrentlyissuedbooks,getborrowinghistory,getallauthors,getallgeners } from '../controller/studentcontoller.js';
import { ocrSearch } from '../controller/ocrcontroller.js';
import studentAuth from '../middleware/studentauth.js';
import upload from '../middleware/multer.js';

const router=express.Router();
router.post('/login',studentlogin)
router.get('/checkauth',checkstudentauth)
router.get('/logout',logout);
router.get('/studentdetails',studentAuth,getstudentdetails)
router.get('/allbooks',getallbooks)
router.post('/issuebook/:bookId',studentAuth,issuebook)
router.get('/currentlyissuedbooks',studentAuth,getcurrentlyissuedbooks)
router.get('/borrowinghistory',studentAuth,getborrowinghistory)
router.get('/allgeners',getallgeners)
router.get('/allauthors',getallauthors)
router.post('/ocr-search', upload.single('image'), ocrSearch)
export default router;