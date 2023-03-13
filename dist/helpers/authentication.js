"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Messagepass_1 = require("./Messagepass");
// Middleware to authenticate JWT token
function authenticate(req, res, next) {
    const authHeader = req.body.token || req.query.token || req.headers["token"] || req.cookies.admissionhelp;
    ;
    if (authHeader) {
        const token = authHeader;
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                const mn = new Messagepass_1.Messagepass('token not valid.', 403);
                return res.status(403).json(mn);
            }
            req.user = user;
            next();
        });
    }
    else {
        const mn = new Messagepass_1.Messagepass('You are not authenticated.', 401);
        return res.status(401).json(mn);
    }
}
exports.authenticate = authenticate;
;
//# sourceMappingURL=authentication.js.map