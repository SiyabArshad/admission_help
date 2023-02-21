import mongoose from "mongoose";
const User=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
    },
    admin:{
        type:Boolean,
        default:false
    },
    alert:{
        type:Boolean,
        default:false
    }
})

export default mongoose.model("users",User)