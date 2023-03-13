"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    },
    admin: {
        type: Boolean,
        default: false
    },
    alert: {
        type: Boolean,
        default: false
    }
});
exports.default = mongoose_1.default.model("users", User);
//# sourceMappingURL=Users.js.map