const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sentResetSuccessEmail
} = require('../mailtrap/email');


// signup api...
const signup = async (req,res)=>{
    const {email,password,name} = req.body;
    try{
        if(!email || !name || !password){
            return res.json({message:'all fields are required!'});
        }

        // check email already exist...
        const userAlreadyExist = await User.findOne({email});
        if(userAlreadyExist){
            return res.status(400).json({message:"something went wrong..."});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const verificationToken = Math.floor(100000+ Math.random()*900000).toString();

        // creating user...
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24*60*60*1000 // 24 hours
        });
        await user.save();
        
        await sendVerificationEmail(user.email, verificationToken);

        
        // giving token...
        generateToken(res, user._id);
        res.status(201).json({
            success: true,
            message: "user created successfully🥳",
            user:{
                ...user._doc,
                password: null,
            },
        });

    }
    catch(err){
        console.log(err);
        res.status(400).json({message:`something went wrong... not proper internet or some thing internal fault: ${err}`});
    }
    
}


// verify email...
const verifyEmail = async(req,res)=>{
    const {code} = req.body;

    try{
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        });

        if(!user){
            return res.status(400)
            .json({success: false ,
                message: "invalid or expired verification code"
            });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.json({success: true, message: "email verified successfuly"});

    }catch(err){
        console.log(err);
        return res.status(400)
        .json({success: false,
            message: "something went wrong"
        });
    }
}


// user acn login...
const login = async (req,res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400)
            .json({success: false, message: "Invalid credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(! isPasswordValid){
            return res.status(400)
            .json({success: false, message: "Invalid credentials"});
        }

        // giving token...
        generateToken(res, user._id);

        // giving new login date...
        user.lastLogin = new Date();
        await user.save();

        // displaying data...
        res.status(201).json({
            success: true,
            message: "user logged in successfully🥳",
            user:{
                ...user._doc,
                password: null,
            },
        });
    }
    catch(err){
        console.log("error in login part: ",err);
        return res.status(400).json({message: "something went wrong..."});
    }
}

// logout user...
const logout = async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({message: "Logout successfully..."});
}


// send reset password email...
const forgetPassword = async(req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        // generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpiresAt = Date.now()+1*60*60*1000; //1 hour


        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;

        await user.save();

        // sent email...
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        return res.status(200).json({message: "Email send..."})
    }
    catch(err){
        console.log("error in forget password part...",err);
        return res.status(400).json({message: "something went wrong..."});
    }
}

// reset password...
const resetPassword = async(req,res)=>{
    try{
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt : Date.now()}
        });

        if(!user){
            return res.status(400).json({message: "something went wrong...User not found"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordExpiresAt = undefined;
        user.resetPasswordToken = undefined;
        await user.save();

        await sentResetSuccessEmail(user.email);
        return res.status(200).json({success:true, message: "Password updated successfully..."});

    }
    catch(err){
        console.log("error in reset password part...",err);
        return res.status(400).json({message: "something went wrong..."});
    }
}

// check auth...
const checkAuth = async(req,res)=>{
    try{
        const user = await User.findById(req.userId).select("-password");
        if(!user){   
            return res.status(400).json({message: "Unauthorized, user not found..."});
        }

        return res.status(200).json({success: true , user});
    }
    catch(err){
        console.log("error in check auth",err);
        return res.status(400).json({message: "something went wrong..in check auth..."});
    }
}


module.exports = {
    signup ,
    login ,
    logout,
    verifyEmail,
    forgetPassword,
    resetPassword,
    checkAuth
};
