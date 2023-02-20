import mongoose from "mongoose";
const options:object= {
    useNewUrlParser:true,
    useUnifiedTopology: true
  }
export function connection(){
    mongoose.connect(process.env.DBURL,options)
      .then(() => console.log('MongoDB Connected...'))
      .catch(err => console.log(err))
}