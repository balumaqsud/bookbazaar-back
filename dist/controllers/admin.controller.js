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
const member_enum_1 = require("../libs/enums/member.enum");
const Errors_1 = __importStar(require("../libs/Errors"));
const adminController = {}; //Object with type of T
const memberService = new Member_service_1.default(); //instance from MemberService!
adminController.goHome = (req, res) => {
    try {
        res.render("home");
    }
    catch (error) {
        console.log("goHome", error);
    }
};
adminController.login = (req, res) => {
    try {
        res.render("login");
    }
    catch (error) {
        console.log("goHome", error);
    }
};
adminController.signup = (req, res) => {
    try {
        res.render("signup");
    }
    catch (error) {
        console.log("signin", error);
    }
};
//signin process
adminController.processSignUp = async (req, res) => {
    try {
        //getting user's request
        console.log("Process signUP");
        const newMember = req.body;
        if (!req.file)
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.PROFILE_IMAGE_NEEDED);
        newMember.memberType = member_enum_1.MemberType.ADMIN; //setting memberType as Admin
        //passing it to MemberService's method and getting result
        const result = await memberService.processSignUp(newMember);
        req.session.member = result;
        req.session.save(() => {
            res.redirect("/admin/product/all");
        });
    }
    catch (error) {
        console.log("Process signUp error", error);
        const message = error instanceof Errors_1.default ? error.message : Errors_1.Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}"); window.location.reload(); window.location.replace('login')</script> `);
    }
};
//login process
adminController.processLogin = async (req, res) => {
    try {
        console.log("login process");
        //getting user's request with type of  LoginType
        const input = req.body;
        //passing input to processLogin Method of memberService;
        const result = await memberService.processLogin(input);
        req.session.member = result;
        req.session.save(() => {
            res.redirect("/admin/product/all");
        });
    }
    catch (error) {
        console.log("processLogin", error);
        const message = error instanceof Errors_1.default ? error.message : Errors_1.Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}");  window.location.reload();  window.location.replace('/admin/login')</script> `);
    }
};
//checking if auth session works
adminController.checkAuthSession = async (req, res) => {
    try {
        if (req.session?.member)
            res.send(`<script>alert("${req.session.member.memberNick}");  window.location.reload(); window.location.replace('/admin/login')</script> `);
        else {
            res.send(`<script>alert("${Errors_1.Message.NOT_AUTHENTICATED}");  window.location.reload(); window.location.replace('/admin/login')</script>`);
        }
    }
    catch (error) {
        console.log("checkAuthSession:", error);
        res.send(error);
    }
};
//logout
adminController.logout = async (req, res) => {
    try {
        console.log("logout");
        req.session.destroy(() => {
            res.redirect("/admin/login");
        });
    }
    catch (error) {
        console.log("logout error", error);
        res.redirect("/admin/login");
    }
};
adminController.getAllUsers = async (req, res) => {
    try {
        console.log("getAllUsers");
        const result = await memberService.getAllUsers();
        res.render("users", { users: result });
    }
    catch (error) {
        console.log("getAllUsers error", error);
        res.redirect("/admin/login");
    }
};
adminController.updateTheUser = async (req, res) => {
    try {
        console.log("updateTheUser");
        const result = await memberService.updateTheUser(req.body);
        return res.status(200).json({ data: result });
    }
    catch (error) {
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error.message);
        else
            res.json(Errors_1.default.standard.code).json(Errors_1.default.standard.message);
    }
};
//creating method that later works as middleware, to check if admin.memberType is Admin, using next()
adminController.verifyAdmin = (req, res, next) => {
    if (req.session?.member?.memberType === member_enum_1.MemberType.ADMIN) {
        req.member = req.session.member; //this line +
        next();
    }
    else {
        res.send(`<script>alert("${Errors_1.Message.NOT_AUTHENTICATED}"); window.location.reload(); window.location.replace('/admin/login')</script>`);
    }
};
exports.default = adminController;
