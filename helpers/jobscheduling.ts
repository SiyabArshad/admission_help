import cron from "node-cron"
import { Messagepass } from "../helpers/Messagepass";
import nodemailer from "nodemailer"
import Users from "../models/Users";
type Transporter=nodemailer.Transporter
  const transporter:Transporter= nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "Shaheerkhan4525@gmail.com",
        pass: "wtbbypqhgmnezdkg",
      }
});
const sendemail=async(name:string,email:string)=>{
    try{
        const emailOptions:nodemailer.SendMailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Admisison open',
            html: `<p>Admisison open in ${name}</p>`,
          };
          await transporter.sendMail(emailOptions);
    }
    catch(e){
        console.log("failed to sent email"+e)
    }
}
async function sendemailtosubscribedusers(uniname: string) {
    try {
        let users = await Users.find({ alert: true });
        let emails = [];
        if (users.length > 0) {
            users.map((us) => {
                emails.push(us.email);
            });
            emails.map((item) => {
                sendemail(uniname,item);
            });
            }
    }
    catch {
        //something wentwrong
        console.log("failed");
    }
}


export const scheduleajob=(name:string)=>{
        sendemailtosubscribedusers(name)
}