import{Request,Response} from "express"
import { Messagepass } from "../helpers/Messagepass";
import mongoose from "mongoose";
import crypto from "crypto-js"
import nodemailer from "nodemailer"
import Users from "../models/Users";
import jwt from "jsonwebtoken"
const encrypt = (plainText:string) => {
    const cipherText:string = crypto.AES.encrypt(plainText, process.env.JWT_SECRET).toString();
    return cipherText;
  };
  
  // Decrypt function
  const decrypt = (cipherText:string) => {
    const bytes = crypto.AES.decrypt(cipherText, process.env.JWT_SECRET);
    const plainText:string = bytes.toString(crypto.enc.Utf8);
    return plainText;
  };
  type Transporter=nodemailer.Transporter
  const transporter:Transporter= nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: "Shaheerkhan4525@gmail.com",
      pass: "wtbbypqhgmnezdkg",
    },
});

interface bodyformat{
    username:string
    email:string
    password:string,
    token:string
}
export async function Signupfunc(req: Request, res: Response){
    try {
        const { username, email,password }:bodyformat = req.body;
        const check=await Users.findOne({email})
        if(check)
        {
            const mn=new Messagepass('Error creating user. Email Already used.',400)
            return res.status(400).json(mn)
        }
        // Hash password
        const hashedPassword:string = encrypt(password)
        // Create user
        const user = new Users({
          username,
          email,
          password: hashedPassword
        });        
        const user1=await user.save();
        const mn=new Messagepass('User created successfully.',200)
        return res.status(200).json(mn);
      } catch (error) {
        const mn=new Messagepass('Error creating user. Please try again later.',500)
        return res.status(500).json(mn);
      }
}

export async function Loginfunc(req: Request, res: Response){
    try {
        const { email, password }:bodyformat = req.body;
        // Find user by email
        const user = await Users.findOne({ email });
        if (!user)
        {
            const mn=new Messagepass('Email or password is incorrect.',400)
            return res.status(400).json(mn);
        }
        // Check password
        const isPasswordCorrect:string =decrypt(user.password)
        if (isPasswordCorrect!==password)
        {
            const mn=new Messagepass('Email or password is incorrect.',401)
            return res.status(401).json(mn);
        }
    
        // Create and sign JWT
        const token = jwt.sign({ userId: user._id,admin:user.admin }, process.env.JWT_SECRET, { expiresIn: '30d' });
        const userWithoutPassword = { ...user.toObject(), password: undefined };
        const mn=new Messagepass({user:userWithoutPassword,token},200)
        res.cookie('admissionhelp', token, { httpOnly: true, secure:false,maxAge: 2592000000 });
        return res.status(200).json(mn);
      } catch (error) {
        const mn=new Messagepass('Error logging in. Please try again later.',500)
        return res.status(500).json(mn);
      }
   
}

export async function Forgotfunc(req: Request, res: Response){
    try {
        const { email }:bodyformat = req.body;
        // Find user by email
        const user = await Users.findOne({ email });
        if (!user){
            const mn=new Messagepass('Email not found.',400)
            return res.json(mn);
        }
        // Create reset password token
        const resetPasswordToken:string = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Send reset password email
        const resetPasswordLink:string = `${process.env.CLIENTRESET}=${resetPasswordToken}`;
        const emailOptions:nodemailer.SendMailOptions = {
          from: process.env.GMAIL,
          to: email,
          subject: 'Reset Password',
          html: `<p>Please follow this link to reset your password: <a href="${resetPasswordLink}">${resetPasswordLink}</a></p>`,
        };
        await transporter.sendMail(emailOptions);
        const mn=new Messagepass('Reset password email sent.',200)
        return res.json(mn);
      } catch (error) {
        console.log(error)
        const mn=new Messagepass('Error sending reset password email. Please try again later.',500)
        return res.json(mn);
      }
    
    }

export async function Newpassfunc(req: Request, res: Response){
    try {
        const { password, token }:bodyformat = req.body;
        // Verify reset password token
        const decoded:any = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded)
         {
            const mn=new Messagepass('token invalid',40)
            return res.json(mn);
         }
        // Find user by reset password token
        const user = await Users.findOne({
          _id: decoded.userId,
         });
        if (!user){
            const mn=new Messagepass('token expired',401)
            return res.json(mn);
        }
        // Hash new password
        const hashedPassword = encrypt(password)
    
        // Update user password and reset password token
        user.password = hashedPassword;
        await user.save();
        const mn=new Messagepass('Password updated',200)
        return res.json(mn);
      } catch (error) {
        const mn=new Messagepass('Error updating password. Please try again later.',500)
        return res.json(mn);
      }
}

export async function Loginwithgoogle(req: Request, res: Response){
        const token = jwt.sign({ userId: req.user._id,admin:req.user.admin}, process.env.JWT_SECRET, { expiresIn: '30d' });
        const userWithoutPassword = { ...req.user.toObject(), password: undefined };
        const mn=new Messagepass({user:userWithoutPassword,token},200)
        res.cookie('admissionhelp', token, { httpOnly: true,secure:false, maxAge: 2592000000 });
        res.redirect(process.env.GOOGLE_SUCCESS_URL);
}

export async function Loginwithgooglefailed(req: Request, res: Response){
  const mn=new Messagepass("Login Failed",400)
  res.redirect(process.env.GOOGLE_FAILURE_URL);
  res.status(400).json(mn);
}
export const getprofile=async(req:Request,res:Response)=>{
  try{
    const profile = await Users.aggregate([
      { $match: { _id:new mongoose.Types.ObjectId(req.user.userId) } }, // Match the document id
      { $project: { password: 0 } } // Exclude the password field
    ])
    if (profile) {
      const mn=new Messagepass(profile,200)
      return res.status(200).json(mn);
    } else {
      const mn=new Messagepass("Operation Failed",404)
      return res.status(404).json(mn);
    }
  }
  catch{
    const mn=new Messagepass("Try again later",500)
    return res.status(500).json(mn);
  }
}
export const updatealerts=async(req:Request,res:Response)=>{
  try{
    const data = req.body;
    const updatedData = await Users.findByIdAndUpdate(req.user.userId, data, { new: true });
    if (updatedData) {
      const mn=new Messagepass(updatedData,200)
      return res.status(200).json(mn);
    } else {
      const mn=new Messagepass("Update Failed",404)
      return res.status(404).json(mn);
    }
  }
  catch{
    const mn=new Messagepass("Try again later",500)
    return res.status(500).json(mn);
  }
}