import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const newBooking = async (req,res,next)=>{
    const {movie,date, seatNumber, user} = req.body;

    let existingMovie;
    let existingUser;
    
    try {
        existingMovie = await Movie.findById(movie);
        existingUser = await User.findById(user);
    } catch (error) {
        return console.log(error);
    }

    if(!existingMovie){
        return res.status(404).json({message:"Movie not found"});
    }

    if(!existingUser){
        return res.status(404).json({message:"User not found with given ID"});
    }


    let newBookings;

    try {
       newBookings = new Booking({movie,date:new Date(`${date}`), seatNumber, user});

       const session = await mongoose.startSession();
    //    (await session).startTransaction();
       existingUser.bookings.push(newBookings);
       existingMovie.bookings.push(newBookings);
       await existingUser.save({session});
       await existingMovie.save({session});
       await newBookings.save({session});
    //    (await session).commitTransaction;


    //    newBookings = await newBookings.save();
    } catch (error) {
        return console.log(error);
    }

    if(!newBookings){
        return res.status(400).json({message:"No booking"});
    }
    return res.status(200).json({newBookings})
}

export const getBookingById = async (req,res,next)=>{
    const id = req.params.id;
    let booking;
    try {
        booking = await Booking.findById(id);
    } catch (error) {
        return console.log(error);
    }

    if(!booking){
        return res.status(500).json({message:"Unexpected Error"});
    }
    return res.status(200).json({booking});
}


export const deleteBooking = async (req,res,next) => {
    const id = req.params.id;
    let booking;
    try {
        booking = await Booking.findByIdAndDelete(id).populate("user movie");
        const session = await mongoose.startSession();
        booking.user.bookings.pull(booking);
        booking.movie.bookings.pull(booking);

        await booking.movie.save({session});
        await booking.user.save({session});


    } catch (error) {
        return console.log(error);
    }

    if(!booking){
        return res.status(500).json({message:"Unable to delete the booking"});
    }
    return res.status(200).json({message:"successfully deleted"});
}