import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Users from '../models/Users';

export function passportgoogle(passport:any)
{
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken:any, refreshToken:any, profile:any, done:any) => {
        // Find or create user based on Google profile
        const user = await Users.findOne({ email: profile.emails[0].value });
        if (!user) {
          const newUser = new Users({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: null // You can add a default password here if necessary
          });
          await newUser.save();
          done(null, newUser);
        } else {
          done(null, user);
        }
      }
    ));
    
    // Serialize and deserialize user
    passport.serializeUser((user:any, done:any) => {
      done(null, user.id);
    });
    
    passport.deserializeUser(async (id:any, done:any) => {
      const user = await Users.findById(id);
      done(null, user);
    });
}