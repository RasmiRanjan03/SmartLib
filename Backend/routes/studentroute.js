import express from 'express';
import { studentlogin,checkstudentauth,logout } from '../controller/studentcontoller.js';
import multer from 'multer';

const router=express.Router();
router.post('/login',studentlogin)
router.get('/checkauth',checkstudentauth)
router.get('/logout',logout);

export default router;