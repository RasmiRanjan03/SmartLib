import Student from "../Model/studentmodel.js";
import Book from "../Model/bookmodel.js";
import IssuedBook from "../Model/issuedbookmodel.js";
import {v2 as cloudinary} from 'cloudinary';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();
const addstudent=async (req,res)=>{
    try{
        const {name,email,course,branch,redg,password}=req.body;
        const profilepicurl=req.file;
        if (!profilepicurl) {
            return res.json({ success: false, message: "Profile picture is required" });
        }
        if(!name){
            return res.json({success:false,message:"Name Must be required"})
        }
        if(!email){
            return res.json({success:false,message:"Email Id must be required"})
        }
        if(await Student.findOne({email:email})){
            return res.json({success:false,message:"Email Id already registered"})  
        }
        if(!redg){
            return res.json({success:false,message:"Redg Number must be required"})
        }
        if(await Student.findOne({redg:redg})){
            return res.json({success:false,message:"Redg Number already registered"})  
        }
        if(!course && !branch){
            return res.json({success:false,message:"Course and Branch must be required"})
        }
        const imageupload = await cloudinary.uploader.upload(profilepicurl.path, {
            resource_type: 'image',
        });
        const imageUrl = imageupload.secure_url;
        const newStudent=new Student({
            name,
            email,
            course,
            branch,
            redg,
            password,
            profilepicurl:imageUrl
        })
        await newStudent.save();
        res.json({success:true,message:"Student Added Successfully"})
    }catch(error){
        console.error("Error adding student:", error);
        res.json({success:false,message:"Internal Server Error"})
    }
}
const updatestudent = async (req, res) => {
    try {
        const { _id, name, email, course, branch, redg, password } = req.body;
        if (!_id) {
            return res.json({ success: false, message: "Student ID is required" });
        }
        let updateData = {
            name, 
            email, 
            course, 
            branch, 
            redg, 
            password 
        };


        if (req.file) {
            const imageupload = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image',
            });

            updateData.profilepicurl = imageupload.secure_url;
        }

        const updatedStudent = await Student.findByIdAndUpdate(_id, updateData, { new: true });

        if(!updatedStudent) {
            return res.json({ success: false, message: "Student not found" });
        }
        res.json({ success: true, message: "Student Updated Successfully", data: updatedStudent });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Internal Server Error" });
    }
}
const addbook=async (req,res)=>{
    try{
        const {title,author,genre,summary,totalcopies,keywords,rating,reviewcount}=req.body;
        const coverImageUrl=req.file;
        const imageupload = await cloudinary.uploader.upload(coverImageUrl.path, {
            resource_type: 'image',
        });
        const imageUrl = imageupload.secure_url;
        const newbook=new Book({
            title,
            author,
            totalcopies,
            availablecopies:totalcopies,
            keywords:keywords ? keywords.split(',').map(kw => kw.trim()) : [],
            genre,
            summary,
            rating,
            reviewcount,
            addedDate:Date.now(),
            coverImageUrl:imageUrl});
        await newbook.save();
        res.json({success:true,message:"Book Added Successfully"})
        }catch(error){
        console.error("Error adding book:", error);
        res.json({success:false,message:"Internal Server Error"})
    }
}
const issuebook=async (req,res)=>{
    try{
        const {studentId,bookId}=req.body;
        const student=await Student.findById(studentId);
        const book=await Book.findById(bookId);
        if(!student){
            return res.json({success:false,message:"Student Not Found"})
        }
        if(!book){
            return res.json({success:false,message:"Book Not Found"})
        }
        if(book.availablecopies<=0){
            return res.json({success:false,message:"No Available Copies"})
        }
        const newissue=new IssuedBook({
                    userId:studentId,
                    bookId,
                })
                await newissue.save();
                book.availablecopies-=1;
                await book.save();
                return res.json({success:true,message:"Book Issued Successfully"})
            }
        catch(error){
        console.error("Error issuing book:", error);
        res.json({success:false,message:"Internal Server Error"})
    }}
const loginadmin=(req,res)=>{
    try{

        const {email,password}=req.body;
        if(!email || !password){
            return res.json({success:false,message:"Email and Password must be required"})
        }
        
        if(email==process.env.admin_email && password==process.env.password){
            const atoken=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'1h'});
            res.cookie('atoken', atoken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path:'/',
            maxAge: 60 * 60 * 1000
        });
            res.json({success:true,message:"Admin Login Successful"})
        }else{
            res.json({success:false,message:"Invalid Admin Credentials"})
        }
    }catch(error){
        console.error("Error logging in admin:", error);
        res.json({success:false,message:"Internal Server Error"})
    }
}
const checkadmin=(req,res)=>{
    try{
        const atoken=req.cookies?.atoken;
        if(!atoken){
            return res.json({success:false,message:"Not Authenticated"})
        }
        const decode=jwt.verify(atoken,process.env.JWT_SECRET);
        if(decode.email!==process.env.admin_email){
            return res.json({success:false,message:"Not Authenticated"})
        }
        res.json({success:true,message:"Admin Authenticated"})
    }catch(error){
        console.error("Error checking admin:", error);
        res.json({success:false,message:"Internal Server Error"})
    }
}
const logoutadmin=(req,res)=>{
    try{
        res.clearCookie('atoken', { path: '/', secure: true, sameSite: 'none' });
        res.json({success:true,message:"Admin Logged Out Successfully"})
    }catch(error){
        console.error("Error logging out admin:", error);
        res.json({success:false,message:"Internal Server Error"})
    }}
const getallstudents=async (req,res)=>{
    try{
        const students=await Student.find();
        res.json({success:true,students})
    }catch(error){
        console.error("Error fetching students:", error);
        res.json({success:false,message:"Internal Server Error"})
    }}
const getallbooks=async (req,res)=>{
    try{
        const books=await Book.find();
        res.json({success:true,books})
    }catch(error){
        console.error("Error fetching books:", error);
        res.json({success:false,message:"Internal Server Error"})
    }}
const getissuedbooks=async (req,res)=>{
    try{
        const issuedBooks=await IssuedBook.find();
        res.json({success:true,issuedBooks})
    }catch(error){
        console.error("Error fetching issued books:", error);
        res.json({success:false,message:"Internal Server Error"})
    }}
export {addstudent,addbook,getallstudents,loginadmin,checkadmin,logoutadmin,getallbooks,getissuedbooks,issuebook,updatestudent};