import express from "express";
import { addMovie, getAllMovies } from "../controllers/movie-controller.js";

const moviesRouter = express.Router();

moviesRouter.post("/", addMovie);
moviesRouter.get("/", getAllMovies);


export default moviesRouter;