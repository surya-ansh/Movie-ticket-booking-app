import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Movie from '../models/Movie.js';
import Admin from "../models/Admin.js";






export const addMovie = async (req,res,next)=>{
    const extractedToken = req.headers.authorization.split(" ")[1];
    if(!extractedToken) {
        return res.status(404).json({message:"Token not found"});
    }

    let adminId;
    // verify admin has token

    jwt.verify(extractedToken,process.env.SECRET_KEY, (err,decrepted)=>{
        if(err){
            return res.status(400).json({message:`${err.message}`})
        }

        adminId = decrepted.id;
        return;
    })


    // create new movie
    const {title, description, releaseDate, posterUrl, featured} = req.body;

    if(!title || !description || !posterUrl || !featured){
        return res.status(422).json({message:"Invalid output"})
    }

    let movie;
    try {
        movie = new Movie({title, description, releaseDate: new Date(`${releaseDate}`),posterUrl, featured, admin: adminId});


        const session = await mongoose.startSession();
        const adminUser = await Admin.findById(adminId);

        // session.startTransaction();
        await movie.save({session});
        adminUser.addedMovies.push(movie);
        await adminUser.save({session});
        // await session.commitTransaction();

        // await movie.save();

    } catch (error) {
        return console.log(error);
    }

    if(!movie){
        return res.status(500).json({message:"request failed"});

    }

    return res.status(201).json({movie});
}


export const getAllMovies = async (req,res,next)=>{
    let movies;
    try {
        movies = await Movie.find();
    } catch (error) {
        return console.log(error);
    }

    if(!movies){
        return res.status(500).json({message:"request failed"});
    }

    return res.status(200).json({movies});
}