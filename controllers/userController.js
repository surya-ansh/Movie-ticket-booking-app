import Booking from "../models/Booking.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (error) {
        return next(error);
    }

    if (!users) {
        return res.status(500).json({ message: "Unexpected error occurred" });
    }

    return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    // Corrected input validation
    if (!name || !email || !password) {
        return res.status(422).json({ message: "Invalid inputs" });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    let user;
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Create new user and save to the database
        user = new User({ name, email, password: hashedPassword });
        user = await user.save();
    } catch (error) {
        return next(error); // Pass the error to the next middleware
    }

    if (!user) {
        return res.status(500).json({ message: "Unexpected error occurred" });
    }

    return res.status(201).json({ user });
};

export const updateUser = async (req, res, next) => {
    const { id } = req.params; // Destructuring to get id
    const { name, email, password } = req.body;

    // Corrected input validation
    if (!name || !email || !password) {
        return res.status(422).json({ message: "Invalid inputs" });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    let user;
    try {
        // Update user
        user = await User.findByIdAndUpdate(id, { name, email, password: hashedPassword }, { new: true });
    } catch (error) {
        return next(error); // Pass the error to the next middleware
    }

    if (!user) {
        return res.status(500).json({ message: "Something went wrong" });
    }

    return res.status(200).json({ message: "Updated successfully", user });
};

export const deleteUser = async (req,res,next) => {
    const id = req.params.id;

    let user;

    try {
        user = await User.findByIdAndDelete(id)
    } catch (error) {
        return console.log(error);
    }

    if(!user){
        return res.status(500).json({message:"user does not exist"});
    }
    res.status(200).json({message:"user deleted successfully"})

    
}


export const login = async (req,res,next) =>{
    const{email, password} = req.body;

    if (!email || !password) {
        return res.status(422).json({ message: "Invalid inputs" });
    }

    let existingUser;
    try {
        existingUser = await User.findOne({email});

    } catch (error) {
        return console.log(error);
    }

    if(!existingUser){
        return res.status(404).json({message:"User does not exist"})
    }

    const comparePassword = bcrypt.compareSync(password,existingUser.password);

    if(!comparePassword){
        return res.status(400).json({message:"Incorrect Password"});
    }

    res.status(200).json({message:"logged in succesfully"});
}



export const getBookingsOfUser = async (req,res,next)=>{
    const id = req.params.id;
    let bookings;
    try {
        bookings = await Booking.find({user:id});
    } catch (error) {
        return console.log(error);
    }

    if(!bookings){
        return res.status(500).json({message:"unable to get the user"});
    }
    return res.status(200).json({bookings});
}
