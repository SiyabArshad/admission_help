"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const universities_1 = __importDefault(require("./routes/universities"));
const dotenv_1 = require("dotenv");
const connection_1 = require("./helpers/connection");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const Passport_1 = require("./helpers/Passport");
const cors = require('cors');
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, dotenv_1.config)();
(0, connection_1.connection)();
(0, Passport_1.passportgoogle)(passport_1.default);
app.use((0, express_session_1.default)({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use(cors({ origin: 'http://127.0.0.1:5173' }));
app.use("/admissionhelp", auth_1.default);
app.use("/admissionhelp", universities_1.default);
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/callback', passport_1.default.authenticate('google', { failureRedirect: '/admissionhelp/loginfailed' }), (req, res) => {
    res.redirect('/admissionhelp/gooleauth');
});
app.listen(process.env.PORT, () => {
    return console.log(`Express is listening at http://localhost:${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map