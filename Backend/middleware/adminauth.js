import jwt from "jsonwebtoken";
const adminAuth = async (req, res, next) => {
    try{
        const atoken = req.cookies?.atoken;
        if (!atoken) {
            return res.status(401).json({ success: false, message: "Not Authenticated" });
        }
        const decode = jwt.verify(atoken, process.env.JWT_SECRET);
        if (decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: "Not Authenticated" });
        }
        next();
    }catch(error){
        console.error("Error in admin authentication middleware:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }}
export default adminAuth;