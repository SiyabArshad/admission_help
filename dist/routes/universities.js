"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route = (0, express_1.Router)();
const authentication_1 = require("../helpers/authentication");
const datacontroller_1 = require("../controller/datacontroller");
route.post("/getdata", authentication_1.authenticate, datacontroller_1.scarpedata);
route.get("/getunisdata", authentication_1.authenticate, datacontroller_1.getunisdata);
route.get("/getsearchdata", authentication_1.authenticate, datacontroller_1.getsearchunisdata);
exports.default = route;
//# sourceMappingURL=universities.js.map