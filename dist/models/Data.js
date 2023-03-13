"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UniData = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    programs: {
        type: Array,
    },
    lastdate: {
        type: String,
    },
    poster: {
        type: String
    }
});
exports.default = mongoose_1.default.model("unidatas", UniData);
//# sourceMappingURL=Data.js.map