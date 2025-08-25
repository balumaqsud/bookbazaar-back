"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToMongoDbId = exports.MORGAN_STANDARD = exports.AUTH_TIME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.AUTH_TIME = 48;
exports.MORGAN_STANDARD = `:method :url :response-time :status \n`;
const convertToMongoDbId = (target) => {
    return typeof target === "string"
        ? new mongoose_1.default.Types.ObjectId(target)
        : target;
};
exports.convertToMongoDbId = convertToMongoDbId;
