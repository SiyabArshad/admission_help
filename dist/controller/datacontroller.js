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
exports.getsearchunisdata = exports.getunisdata = exports.scarpedata = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = require("cheerio");
const Messagepass_1 = require("../helpers/Messagepass");
const Data_1 = __importDefault(require("../models/Data"));
const jobscheduling_1 = require("../helpers/jobscheduling");
const scarpedata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.admin === true) {
        try {
            let programsoffered = [];
            const urlin = `${req.body.uniurl}`;
            const { data } = yield axios_1.default.get(urlin, {
                headers: { "Accept-Encoding": "gzip,deflate,compress" }
            });
            const $ = cheerio.load(data);
            const titleinfo = $(".page-title h1").text(); //geting name of university
            const poster = $(".post_thumb a img").attr("src");
            const lastdateapply = $(".post_content h3").filter((i, it) => i === 0).text();
            const programsinfo = $(".sc_list li a").each((index, item) => {
                programsoffered.push($(item).text());
            });
            const uniname = $(".odd p a").text();
            const alreadydata = yield Data_1.default.findOne({ title: titleinfo });
            if (alreadydata) {
                const mn = new Messagepass_1.Messagepass('Data already present on the platform', 400);
                return res.status(400).json(mn);
            }
            else {
                let admisiondetails = new Data_1.default({
                    name: uniname,
                    title: titleinfo,
                    programs: programsoffered,
                    lastdate: lastdateapply,
                    poster: poster
                });
                yield admisiondetails.save();
                (0, jobscheduling_1.scheduleajob)(uniname);
                const mn = new Messagepass_1.Messagepass('Generated data successfully', 200);
                return res.status(200).json(mn);
            }
        }
        catch (e) {
            const mn = new Messagepass_1.Messagepass('Failed to Generate data', 500);
            return res.status(500).json(mn);
        }
    }
    else {
        const mn = new Messagepass_1.Messagepass('You dont have admin access', 403);
        return res.status(403).json(mn);
    }
});
exports.scarpedata = scarpedata;
const getunisdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const datainfo = yield Data_1.default.find();
        const mn = new Messagepass_1.Messagepass(datainfo, 200);
        return res.status(200).json(mn);
    }
    catch (_a) {
        const mn = new Messagepass_1.Messagepass('Sorry something went wrong', 500);
        return res.status(500).json(mn);
    }
});
exports.getunisdata = getunisdata;
const getsearchunisdata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        const regx = new RegExp(name, 'i');
        const results = yield Data_1.default.find({ name: { $regex: regx } }).exec();
        const mn = new Messagepass_1.Messagepass(results, 200);
        return res.status(200).json(mn);
    }
    catch (_b) {
        const mn = new Messagepass_1.Messagepass('Sorry something went wrong', 500);
        return res.status(500).json(mn);
    }
});
exports.getsearchunisdata = getsearchunisdata;
//# sourceMappingURL=datacontroller.js.map