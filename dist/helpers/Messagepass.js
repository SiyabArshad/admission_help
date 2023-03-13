"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messagepass = void 0;
var tyeofmesage;
(function (tyeofmesage) {
    tyeofmesage["pass"] = "Success";
    tyeofmesage["fail"] = "Failed";
})(tyeofmesage || (tyeofmesage = {}));
class Messagepass {
    constructor(mess, statuscode) {
        this.message = mess;
        if (statuscode !== 200) {
            this.responsetype = tyeofmesage.fail;
        }
        else {
            this.responsetype = tyeofmesage.pass;
        }
    }
}
exports.Messagepass = Messagepass;
//# sourceMappingURL=Messagepass.js.map