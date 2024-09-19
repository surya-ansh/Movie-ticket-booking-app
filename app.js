import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import dotenv from "dotenv";
import moviesRouter from "./routes/movie-routes.js";
import bookingRouter from "./routes/booking-routes.js";


dotenv.config();

const app = express();
app.use(express.json());

// middlewares
app.use("/user", router);
app.use("/admin", adminRouter);
app.use("/movie", moviesRouter);
app.use("/booking", bookingRouter);


mongoose.connect("mongodb://localhost:27017/Movieticketbookingapplication")
    .then(()=>console.log("MongoDB connected"))
    .catch((error)=>console.log(error));

app.listen(5000, ()=>{
    console.log(`app is running on ${5000}`);
})