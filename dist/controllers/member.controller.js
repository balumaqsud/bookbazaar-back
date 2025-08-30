"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Member_service_1 = __importDefault(require("../model/Member.service"));
const Errors_1 = __importStar(require("../libs/Errors"));
const Auth_service_1 = __importDefault(require("../model/Auth.service"));
const config_1 = require("../libs/config");
const memberService = new Member_service_1.default();
const authService = new Auth_service_1.default();
const memberController = {};
memberController.getAdmin = async (req, res) => {
    try {
        console.log("getRestaurant");
        const result = await memberService.getAdmin();
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (error) {
        console.log("getRestaurant, error:", error);
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.signup = async (req, res) => {
    try {
        console.log("signup here!");
        console.log("body", req.body);
        const input = req.body, result = await memberService.signup(input);
        const token = await authService.createToken(result);
        res.cookie("accessToken", token, {
            maxAge: config_1.AUTH_TIME * 3600 * 1000,
            httpOnly: false,
        });
        res.status(Errors_1.HttpCode.CREATED).json({ member: result, accessToken: token });
    }
    catch (err) {
        console.log("ERROR on Signup page", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.login = async (req, res) => {
    try {
        console.log("login here");
        const input = req.body, result = await memberService.login(input);
        const token = await authService.createToken(result);
        res.cookie("accessToken", token, {
            maxAge: config_1.AUTH_TIME * 3600 * 1000,
            httpOnly: false,
        });
        res.status(Errors_1.HttpCode.OK).json({ member: result, accessToken: token });
    }
    catch (err) {
        console.log("ERROR on Login page", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.logout = async (req, res) => {
    try {
        console.log("logout here");
        res.cookie("accessToken", null, {
            maxAge: 0,
            httpOnly: true,
        });
        res.status(Errors_1.HttpCode.OK).json({ logout: true });
    }
    catch (err) {
        console.log("ERROR on logout page", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
//detail
memberController.getMemberDetail = async (req, res) => {
    try {
        console.log("getMemberDetail");
        const result = await memberService.getMemberDetail(req.member);
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (error) {
        console.log("logout, error:", error);
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error.message);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.updateMember = async (req, res) => {
    try {
        console.log("updateMember");
        const input = req.body;
        if (req.file)
            input.memberImage = req.file.path.replace(/\\/g, "/");
        const result = await memberService.updateMember(req.member, input);
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (error) {
        console.log("updateMember, error:", error);
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error.message);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.getTopUsers = async (req, res) => {
    try {
        console.log("getTopUsers");
        const result = await memberService.getTopUsers();
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (error) {
        console.log("getTopUsers, error:", error);
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error.message);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.verifyAuth = async (req, res, next) => {
    try {
        const token = req.cookies["accessToken"];
        if (token) {
            req.member = await authService.checkAuth(token);
        }
        if (!req.member)
            throw new Errors_1.default(Errors_1.HttpCode.UNAUTHORIZED, Errors_1.Message.NOT_AUTHENTICATED);
        next();
    }
    catch (error) {
        console.log("verifyAuth error", error);
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error.message);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
memberController.retrieveAuth = async (req, res, next) => {
    try {
        const token = req.cookies["accessToken"];
        if (token) {
            req.member = await authService.checkAuth(token);
        }
        next();
    }
    catch (error) {
        console.log("retrieveAuth, error", error);
        next();
    }
};
exports.default = memberController;
