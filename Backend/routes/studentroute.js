import express from 'express';
import { studentlogin,checkstudentauth } from '../controller/studentcontoller.js';
import multer from 'multer';

const router=express.Router();
router.post('/login',studentlogin)
router.get('/checkauth',checkstudentauth)

export default router;