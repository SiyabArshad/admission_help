import express from 'express';
import auth from "./routes/auth"
import universities from "./routes/universities"
import {config} from "dotenv"
import { connection } from './helpers/connection';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import expresssession from "express-session"
import { passportgoogle } from './helpers/Passport';
import { Messagepass } from './helpers/Messagepass';
import cron from "node-cron"

const app = express();
app.use(express.json())

config()
connection()
passportgoogle(passport)

declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }
app.use(expresssession({secret:process.env.JWT_SECRET,resave:false,saveUninitialized:false}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());  
app.use("/admissionhelp",auth)
app.use("/admissionhelp",universities)
app.get("/", (req, res) => {
    res.send("Hello, World!");
  });
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/callback', passport.authenticate('google', { failureRedirect: '/admissionhelp/loginfailed' }), (req, res) => {
  res.redirect('/admissionhelp/gooleauth');
});
app.listen(process.env.PORT, () => {
  return console.log(`Express is listening at http://localhost:${process.env.PORT}`);
});
