"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
function connection() {
    mongoose_1.default.connect(process.env.DBURL, options)
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(err));
}
exports.connection = connection;
//# sourceMappingURL=connection.js.map