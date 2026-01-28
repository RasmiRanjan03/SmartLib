import jwt from "jsonwebtoken";
import Student from "../Model/studentmodel.js";
const studentAuth = async (req, res, next) => {
    try{
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authenticated" });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findById(decode.id);
        if (!student) {
            return res.status(401).json({ success: false, message: "Not Authenticated" });
        }
        next();
    }catch(error){
        console.error("Error in student authentication middleware:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }}
export default studentAuth;