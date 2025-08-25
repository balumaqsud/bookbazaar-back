"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const getTargetAddress = (address) => {
    return multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `./uploads/${address}`);
        },
        filename: (req, file, cb) => {
            console.log(file);
            const extension = path_1.default.parse(file.originalname).ext;
            const file_name = (0, uuid_1.v4)() + extension;
            cb(null, file_name);
        },
    });
};
const uploader = (address) => {
    const storage = getTargetAddress(address);
    return (0, multer_1.default)({ storage: storage });
};
exports.default = uploader;
