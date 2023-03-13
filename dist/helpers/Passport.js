"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportgoogle = void 0;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const Users_1 = __importDefault(require("../models/Users"));
function passportgoogle(passport) {
    passport.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        // Find or create user based on Google profile
        const user = yield Users_1.default.findOne({ email: profile.emails[0].value });
        if (!user) {
            const newUser = new Users_1.default({
                username: profile.displayName,
                email: profile.emails[0].value,
                password: null // You can add a default password here if necessary
            });
            yield newUser.save();
            done(null, newUser);
        }
        else {
            done(null, user);
        }
    })));
    // Serialize and deserialize user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
        const user = yield Users_1.default.findById(id);
        done(null, user);
    }));
}
exports.passportgoogle = passportgoogle;
//# sourceMappingURL=Passport.js.map