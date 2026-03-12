import jwt from "jsonwebtoken";
const adminAuth = async (req, res, next) => {
    try {
        const atoken = req.cookies?.atoken;
        console.log("AdminAuth Middleware - Cookie found:", !!atoken);
        
        if (!atoken) {
            console.log("AdminAuth - No atoken cookie found");
            return res.status(401).json({ success: false, message: "Not Authenticated: No token" });
        }

        const decode = jwt.verify(atoken, process.env.JWT_SECRET);
        console.log("AdminAuth - Token decoded email:", decode.email);
        console.log("AdminAuth - Expected email (from env):", process.env.admin_email);

        if (decode.email !== process.env.admin_email) {
            console.log("AdminAuth - Email mismatch");
            return res.status(401).json({ success: false, message: "Not Authenticated: Email mismatch" });
        }
        
        next();
    } catch (error) {
        console.error("Error in admin authentication middleware:", error);
        res.status(401).json({ success: false, message: "Not Authenticated: Invalid session " + error.message });
    }
};
export default adminAuth;