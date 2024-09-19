import mongoose from "mongoose";

const moviesSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    releaseDate:{
        type:Date,
        required:true,
    },
    posterUrl:{
        type:String,
        required:true,
    },
    featured:{
        type:Boolean,
    },
    bookings: [{
        type:mongoose.Types.ObjectId,
        ref:"Booking",
    }],
    admin:{
        type:mongoose.Types.ObjectId,
        ref:"Admin",
        required:true,
    },

})

export default mongoose.model("Movie", moviesSchema);