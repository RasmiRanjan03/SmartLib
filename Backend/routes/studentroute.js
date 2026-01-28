import express from 'express';
import { studentlogin } from '../controller/studentcontoller.js';
import multer from 'multer';

const router=express.Router();
router.post('/login',studentlogin)

export default router;