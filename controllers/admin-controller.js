import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req,res,next)=>{
    const{email, password} = req.body;

    let existingAdmin;

    try {
        existingAdmin = await Admin.findOne({email});
    } catch (error) {
        return console.log(error)
    }

    if(existingAdmin){
        return res.status(500).json({message:"User already exist"})
    }

    let admin;
    const hashedPassword = bcrypt.hashSync(password,10);
    try {
        admin = new Admin({email, password:hashedPassword});
        admin = await admin.save();
    } catch (error) {
        return console.log(error);
    }

    if(!admin){
        return res.status(500).json({message:"unable to store admin data"});
    }
    return res.status(200).json({message:"admin data added"});

}

export const adminLogin = async (req,res,next) => {
    const{email, password} = req.body;

    let existingAdmin;
    try {
        existingAdmin = await Admin.findOne({email});
    } catch (error) {
        return console.log(error);
    }

    if(!existingAdmin){
        return res.status(400).json({message: "user not found"});
    }

    const passwordMatch = bcrypt.compareSync(password, existingAdmin.password);
    if(!passwordMatch){
        return res.status(400).json({message: "Incorrect Password"});
    }

    const token = jwt.sign({id:existingAdmin._id}, process.env.SECRET_KEY,{
        expiresIn: "7d",
    })
    return res.status(200).json({message:"Authentication complete", token, id:existingAdmin._id})
}


export const getAllAdmin = async(req,res,next)=>{
    let admins;
    try {
        admins = await Admin.find();
    } catch (error) {
        return console.log(err);
    }

    if(!admins){
        return res.status(500).json({message:"Internal server error"});
    }

    return res.status(200).json({admins});
}