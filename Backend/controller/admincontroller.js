import Student from "../Model/studentmodel.js";
import {v2 as cloudinary} from 'cloudinary';
const addstudent=async (req,res)=>{
    try{
        const {name,email,course,branch,redg,password}=req.body;
        const image=req.file;
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
        const imageupload = await cloudinary.uploader.upload(image.path, {
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
export {addstudent};