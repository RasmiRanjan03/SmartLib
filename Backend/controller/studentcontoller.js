import jwt from 'jsonwebtoken';
import Student from '../Model/studentmodel.js';
import Book from '../Model/bookmodel.js';
import IssuedBook from '../Model/issuedbookmodel.js';

const studentlogin=async (req,res)=>{
    try{
        const {redg,password}=req.body;
        if(!redg || !password){
            return res.json({success:false,message:"Redg Number and Password are required"})
        }
        const student=await Student.findOne({redg:redg});
        if(!student){
            return res.json({success:false,message:"Invalid Redg Number or Password"})
        }
        if(student.password!==password){
            return res.json({success:false,message:"Invalid Redg Number or Password"})
        }
        const token=jwt.sign({id:student._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path:'/',
            maxAge: 60 * 60 * 1000
        });
        res.json({success:true,message:"Login Successful"})
    }catch(error){
        console.error("Error during student login:", error);
        res.json({success:false,message:"Internal Server Error"})
    }
}
const logout=async (req,res)=>{
    try{
        res.clearCookie('token',{   
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path:'/',
        });
        res.json({success:true,message:"Logout Successful"})
    }catch(error){
        console.error("Error during student logout:", error);
        res.json({success:false,message:"Internal Server Error"})
    }
}
const checkstudentauth=async (req,res)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.json({success:false,message:"Not Authenticated"})
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        const student=await Student.findById(decode.id).select('-password');
        if(!student){
            return res.json({success:false,message:"Not Authenticated"})
        }
        res.json({success:true,message:"Authenticated"})
}catch(error){
    console.error("Error during student authentication:", error);
    res.json({success:false,message:"Internal Server Error"})
}}
const getstudentdetails=async (req,res)=>{
    try{
        const token=req.cookies?.token;
        if(!token){
            return res.json({success:false,message:"Not Authenticated"})
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        const student=await Student.findById(decode.id).select('-password -joinedDate -__v -_id');
        if(!student){
            return res.json({success:false,message:"Not Authenticated"})
        }
        res.json({success:true,message:"Student Details Fetched",data:student})
    }catch(error){
        console.error("Error fetching student details:", error);
        res.json({success:false,message:"Internal Server Error"})
    }}
const getallbooks=async (req,res)=>{
    try{
        const books=await Book.find({});
        res.json({success:true,message:"All Books Fetched",data:books})
    }catch(error){
        console.error("Error fetching all books:", error);
        res.json({success:false,message:"Internal Server Error"})
    }}
const issuebook=async (req,res)=>{
    try{
        const {bookId}=req.params;
        const token=req.cookies?.token;
        if(!token){
            return res.json({success:false,message:"Not Authenticated"})
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        const newissue=new IssuedBook({
            userId:decode.id,
            bookId,

        })
        await newissue.save();
        const book=await Book.findById(bookId);
        book.availablecopies-=1;
        await book.save();
        return res.json({success:true,message:"Book Issued Successfully"})
    

    }catch(error){
        console.error("Error issuing book:", error);
        res.json({success:false,message:"Internal Server Error"})
}}
export {studentlogin,checkstudentauth,logout,getstudentdetails,getallbooks,issuebook};