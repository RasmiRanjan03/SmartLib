import jwt from 'jsonwebtoken';
import Student from '../Model/studentmodel.js';

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
export {studentlogin};
