import mongoose from "mongoose";
const UniData=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    title:{
        type:String,
    },
    programs:{
        type:Array,
    },
    lastdate:{
        type:String,
    },
    poster:{
        type:String
    }
})

export default mongoose.model("unidatas",UniData)