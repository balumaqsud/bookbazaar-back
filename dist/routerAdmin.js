"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = __importDefault(require("./controllers/admin.controller"));
const product_controller_1 = __importDefault(require("./controllers/product.controller"));
const uploader_1 = __importDefault(require("./libs/utils/uploader"));
const routerAdmin = express_1.default.Router();
//member
routerAdmin.get("/", admin_controller_1.default.goHome);
routerAdmin
    .get("/login", admin_controller_1.default.login)
    .post("/login", admin_controller_1.default.processLogin);
routerAdmin
    .get("/signup", admin_controller_1.default.signup)
    .post("/signup", (0, uploader_1.default)("members").single("memberImage"), admin_controller_1.default.processSignUp);
routerAdmin.get("/check-me", admin_controller_1.default.checkAuthSession);
routerAdmin.get("/logout", admin_controller_1.default.logout);
//product
routerAdmin.get("/product/all", admin_controller_1.default.verifyAdmin, //functioning as middleware to check the admin
product_controller_1.default.getAllProducts);
routerAdmin.post("/product/create", admin_controller_1.default.verifyAdmin, (0, uploader_1.default)("products").array("productImages", 6), product_controller_1.default.createNewProduct);
routerAdmin.post("/product/:id", admin_controller_1.default.verifyAdmin, product_controller_1.default.updateTheProduct);
//user
routerAdmin.get("/user/all", admin_controller_1.default.verifyAdmin, admin_controller_1.default.getAllUsers);
routerAdmin.post("/user/edit", admin_controller_1.default.verifyAdmin, admin_controller_1.default.updateTheUser);
exports.default = routerAdmin;
