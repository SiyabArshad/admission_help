"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authentication_1 = require("../controller/Authentication");
const authentication_1 = require("../helpers/authentication");
const route = (0, express_1.Router)();
route.post("/signup", Authentication_1.Signupfunc);
route.post("/login", Authentication_1.Loginfunc);
route.post("/forgotpass", Authentication_1.Forgotfunc);
route.post("/newpass", Authentication_1.Newpassfunc);
route.get("/gooleauth", Authentication_1.Loginwithgoogle);
route.get("/loginfailed", Authentication_1.Loginwithgooglefailed);
route.post("/updatealert", authentication_1.authenticate, Authentication_1.updatealerts);
route.get("/profile", authentication_1.authenticate, Authentication_1.getprofile);
exports.default = route;
//# sourceMappingURL=auth.js.map