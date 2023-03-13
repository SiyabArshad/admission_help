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
exports.scheduleajob = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Users_1 = __importDefault(require("../models/Users"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: "Shaheerkhan4525@gmail.com",
        pass: "wtbbypqhgmnezdkg",
    }
});
const sendemail = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Admisison open',
            html: `<p>Admisison open in ${name}</p>`,
        };
        yield transporter.sendMail(emailOptions);
    }
    catch (e) {
        console.log("failed to sent email" + e);
    }
});
function sendemailtosubscribedusers(uniname) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let users = yield Users_1.default.find({ alert: true });
            let emails = [];
            if (users.length > 0) {
                users.map((us) => {
                    emails.push(us.email);
                });
                emails.map((item) => {
                    sendemail(uniname, item);
                });
            }
        }
        catch (_a) {
            //something wentwrong
            console.log("failed");
        }
    });
}
const scheduleajob = (name) => {
    sendemailtosubscribedusers(name);
};
exports.scheduleajob = scheduleajob;
//# sourceMappingURL=jobscheduling.js.map