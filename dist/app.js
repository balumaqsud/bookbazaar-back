"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const routerAdmin_1 = __importDefault(require("./routerAdmin"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./libs/config");
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
//for sessions
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
//creating store object:
const MongoStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new MongoStore({
    uri: String(process.env.MONGO_URL),
    collection: "sessions",
});
//entrance ---middlewares
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/uploads", express_1.default.static("./uploads"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)(config_1.MORGAN_STANDARD));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ credentials: true, origin: true })); //allows requests from browsers
//sessions
app.use((0, express_session_1.default)({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
        maxAge: 1000 * 3600 * 8, // 8 hours
    },
    store: store,
    resave: true,
    saveUninitialized: true,
}));
//middleware for getting member from request and passing to res
app.use((req, res, next) => {
    const sessionInstance = req.session;
    res.locals.member = sessionInstance.member;
    next();
});
//views
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
//routing
app.use("/", router_1.default); // will be build in React
app.use("/admin", routerAdmin_1.default); // will be build in EJS
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: true,
        credentials: true,
    },
});
let connectedUsers = 0;
io.on("connection", (socket) => {
    console.log("a user connected");
    connectedUsers++;
    io.emit("connectedUsers", connectedUsers);
    socket.on("disconnect", () => {
        connectedUsers--;
        io.emit("connectedUsers", connectedUsers);
    });
});
exports.default = server;
