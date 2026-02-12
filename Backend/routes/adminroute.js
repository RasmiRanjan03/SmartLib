import {addstudent,addbook,loginadmin,checkadmin,logoutadmin,getallstudents,getallbooks,getissuedbooks,issuebook,updatestudent} from "../controller/admincontroller.js";
import adminAuth from "../middleware/adminauth.js";
import express from 'express';
import upload from '../middleware/multer.js';
const router=express.Router();

router.post('/addstudent',upload.single('profilepicurl'),adminAuth,addstudent);
router.post('/addbook',upload.single('coverImageUrl'),adminAuth,addbook);
router.post('/adminlogin',loginadmin);
router.get('/checkadmin',checkadmin);
router.get('/logoutadmin',logoutadmin);
router.get('/getstudents',adminAuth,getallstudents)
router.get('/getbooks',adminAuth,getallbooks)
router.get('/getissuedbooks',adminAuth,getissuedbooks)
router.post('/issuebook',adminAuth,issuebook)
router.post('/updatestudent',upload.single("profilepicurl"),adminAuth,updatestudent)
export default router;