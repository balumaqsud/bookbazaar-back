"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const path_1 = __importDefault(require("path"));
mongoose_1.default.set("strictQuery", false);
const envPath = path_1.default.resolve(__dirname, process.env.NODE_ENV === "production" ? "../.env.production" : "../.env");
console.log("Loading env file:", envPath);
dotenv_1.default.config({
    path: envPath,
});
//env variables
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("process.env.PORT after dotenv:", process.env.PORT);
const PORT = process.env.NODE_ENV === "production"
    ? process.env.PORT ?? 3004
    : process.env.PORT ?? 3000;
console.log("Final PORT:", PORT);
const MONGO_URL = process.env.MONGO_URL;
//mongo connection with mongoose
mongoose_1.default
    .connect(MONGO_URL, {})
    .then((data) => {
    console.log("mongo db is successfully connected");
    app_1.default.listen(PORT, () => {
        console.log(`app is running in port ${PORT}`);
        console.log(`http://localhost:${PORT}/admin`);
    });
})
    .catch((err) => {
    console.log(err);
});
