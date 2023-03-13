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
exports.updatealerts = exports.getprofile = exports.Loginwithgooglefailed = exports.Loginwithgoogle = exports.Newpassfunc = exports.Forgotfunc = exports.Loginfunc = exports.Signupfunc = void 0;
const Messagepass_1 = require("../helpers/Messagepass");
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const Users_1 = __importDefault(require("../models/Users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const encrypt = (plainText) => {
    const cipherText = crypto_js_1.default.AES.encrypt(plainText, process.env.JWT_SECRET).toString();
    return cipherText;
};
// Decrypt function
const decrypt = (cipherText) => {
    const bytes = crypto_js_1.default.AES.decrypt(cipherText, process.env.JWT_SECRET);
    const plainText = bytes.toString(crypto_js_1.default.enc.Utf8);
    return plainText;
};
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: "Shaheerkhan4525@gmail.com",
        pass: "wtbbypqhgmnezdkg",
    },
});
function Signupfunc(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, email, password } = req.body;
            const check = yield Users_1.default.findOne({ email });
            if (check) {
                const mn = new Messagepass_1.Messagepass('Error creating user. Email Already used.', 400);
                return res.status(400).json(mn);
            }
            // Hash password
            const hashedPassword = encrypt(password);
            // Create user
            const user = new Users_1.default({
                username,
                email,
                password: hashedPassword
            });
            const user1 = yield user.save();
            const mn = new Messagepass_1.Messagepass('User created successfully.', 200);
            return res.status(200).json(mn);
        }
        catch (error) {
            const mn = new Messagepass_1.Messagepass('Error creating user. Please try again later.', 500);
            return res.status(500).json(mn);
        }
    });
}
exports.Signupfunc = Signupfunc;
function Loginfunc(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // Find user by email
            const user = yield Users_1.default.findOne({ email });
            if (!user) {
                const mn = new Messagepass_1.Messagepass('Email or password is incorrect.', 400);
                return res.status(400).json(mn);
            }
            // Check password
            const isPasswordCorrect = decrypt(user.password);
            if (isPasswordCorrect !== password) {
                const mn = new Messagepass_1.Messagepass('Email or password is incorrect.', 401);
                return res.status(401).json(mn);
            }
            // Create and sign JWT
            const token = jsonwebtoken_1.default.sign({ userId: user._id, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: '30d' });
            const userWithoutPassword = Object.assign(Object.assign({}, user.toObject()), { password: undefined });
            const mn = new Messagepass_1.Messagepass({ user: userWithoutPassword, token }, 200);
            res.cookie('admissionhelp', token, { httpOnly: true, maxAge: 2592000000 });
            return res.status(200).json(mn);
        }
        catch (error) {
            const mn = new Messagepass_1.Messagepass('Error logging in. Please try again later.', 500);
            return res.status(500).json(mn);
        }
    });
}
exports.Loginfunc = Loginfunc;
function Forgotfunc(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            // Find user by email
            const user = yield Users_1.default.findOne({ email });
            if (!user) {
                const mn = new Messagepass_1.Messagepass('Email not found.', 400);
                return res.json(mn);
            }
            // Create reset password token
            const resetPasswordToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // Send reset password email
            const resetPasswordLink = `http://127.0.0.1:5173/newpass?token=${resetPasswordToken}`;
            const emailOptions = {
                from: process.env.GMAIL,
                to: email,
                subject: 'Reset Password',
                html: `<p>Please follow this link to reset your password: <a href="${resetPasswordLink}">${resetPasswordLink}</a></p>`,
            };
            yield transporter.sendMail(emailOptions);
            const mn = new Messagepass_1.Messagepass('Reset password email sent.', 200);
            return res.json(mn);
        }
        catch (error) {
            console.log(error);
            const mn = new Messagepass_1.Messagepass('Error sending reset password email. Please try again later.', 500);
            return res.json(mn);
        }
    });
}
exports.Forgotfunc = Forgotfunc;
function Newpassfunc(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { password, token } = req.body;
            // Verify reset password token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                const mn = new Messagepass_1.Messagepass('token invalid', 40);
                return res.json(mn);
            }
            // Find user by reset password token
            const user = yield Users_1.default.findOne({
                _id: decoded.userId,
            });
            if (!user) {
                const mn = new Messagepass_1.Messagepass('token expired', 401);
                return res.json(mn);
            }
            // Hash new password
            const hashedPassword = encrypt(password);
            // Update user password and reset password token
            user.password = hashedPassword;
            yield user.save();
            const mn = new Messagepass_1.Messagepass('Password updated', 200);
            return res.json(mn);
        }
        catch (error) {
            const mn = new Messagepass_1.Messagepass('Error updating password. Please try again later.', 500);
            return res.json(mn);
        }
    });
}
exports.Newpassfunc = Newpassfunc;
function Loginwithgoogle(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({ userId: req.user._id, admin: req.user.admin }, process.env.JWT_SECRET, { expiresIn: '30d' });
        const userWithoutPassword = Object.assign(Object.assign({}, req.user.toObject()), { password: undefined });
        const mn = new Messagepass_1.Messagepass({ user: userWithoutPassword, token }, 200);
        res.cookie('admissionhelp', token, { httpOnly: true, maxAge: 2592000000 });
        // res.redirect("http://127.0.0.1:5173/login")
        return res.status(200).json(mn);
    });
}
exports.Loginwithgoogle = Loginwithgoogle;
function Loginwithgooglefailed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // res.redirect("http://127.0.0.1:5173/login")  
        const mn = new Messagepass_1.Messagepass("Login Failed", 400);
        return res.status(400).json(mn);
    });
}
exports.Loginwithgooglefailed = Loginwithgooglefailed;
const getprofile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Users_1.default.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(req.user.userId) } },
            { $project: { password: 0 } } // Exclude the password field
        ]);
        if (profile) {
            const mn = new Messagepass_1.Messagepass(profile, 200);
            return res.status(200).json(mn);
        }
        else {
            const mn = new Messagepass_1.Messagepass("Operation Failed", 404);
            return res.status(404).json(mn);
        }
    }
    catch (_a) {
        const mn = new Messagepass_1.Messagepass("Try again later", 500);
        return res.status(500).json(mn);
    }
});
exports.getprofile = getprofile;
const updatealerts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const updatedData = yield Users_1.default.findByIdAndUpdate(req.user.userId, data, { new: true });
        if (updatedData) {
            const mn = new Messagepass_1.Messagepass(updatedData, 200);
            return res.status(200).json(mn);
        }
        else {
            const mn = new Messagepass_1.Messagepass("Update Failed", 404);
            return res.status(404).json(mn);
        }
    }
    catch (_b) {
        const mn = new Messagepass_1.Messagepass("Try again later", 500);
        return res.status(500).json(mn);
    }
});
exports.updatealerts = updatealerts;
//# sourceMappingURL=Authentication.js.map